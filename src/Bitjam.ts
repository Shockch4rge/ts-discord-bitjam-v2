import { Client, Collection, Guild } from "discord.js";
import fs from "fs";
import path from "path";

import config from "../config.json";
import { FireStore } from "./app/FireStore";
import GuildCache from "./app/GuildCache";
import { ButtonHelper } from "./helpers/ButtonInteractionHelper";
import { ContextMenuInteractionHelper } from "./helpers/ContextMenuHelper";
import { MessageInteractionHelper } from "./helpers/MessageInteractionHelper";
import { SelectMenuInteractionHelper } from "./helpers/SelectMenuInteractionHelper";
import { SlashInteractionHelper } from "./helpers/SlashInteractionHelper";
import {
    ButtonData, ContextMenuData, MessageCommandData, SelectMenuData, SlashCommandData
} from "./typings/interactions";
import { CommandDeployer } from "./utils/CommandDeployer";
import { Embeds } from "./utils/components/Embeds";
import { logger } from "./utils/logger";


export default class Bitjam extends Client {
	private readonly db: FireStore;
	private readonly guildCaches: Collection<string, GuildCache>;
	public readonly contextMenuInteractions: Collection<string, ContextMenuData>;
	public readonly slashInteractions: Collection<string, SlashCommandData>;
	public readonly messageInteractions: Collection<string, MessageCommandData>;
	public readonly selectMenuInteractions: Collection<string, SelectMenuData>;
	public readonly buttonInteractions: Collection<string, ButtonData>;

	public constructor() {
		super({ intents: ["GUILD_MESSAGES", "GUILDS"] });
		this.db = new FireStore();
		this.guildCaches = new Collection();
		this.slashInteractions = new Collection();
		this.buttonInteractions = new Collection();
		this.selectMenuInteractions = new Collection();
		this.contextMenuInteractions = new Collection();
		this.messageInteractions = new Collection();

		this.setSlashCommandInteractions();
		this.setButtonInteractions();
		this.setSelectMenuInteractions();
		this.setContextMenuInteractions();
		this.setMessageCommands();
		this.setupClientEvents();

		this.login(config.bot_token);
	}

	private setupClientEvents() {
		this.once("ready", async client => {
			const guilds = client.guilds.cache.toJSON();

			for (const guild of guilds) {
				try {
					await this.createGuildCache(guild);
				} catch (err) {
					logger.error(`Couldn't find ${guild.name}`);
				}

				try {
					await CommandDeployer.deploy(
						guild.id,
						this.slashInteractions,
						this.contextMenuInteractions
					);
				} catch (err) {
					logger.error(`[COMMAND_DEPLOY_FAIL] ${guild.name}: ${(err as Error).message}`);
				}

				logger.info(`✅ Deployed commands in ${guild.name}`);
			}

			this.user!.setActivity({
				type: "LISTENING",
				name: "to /help",
			});
			logger.info(`${client.user.tag} is ready!`);
		});

		this.on("error", error => {
			logger.error(`[CLIENT_ERROR]: ${error.message}`);
		});

		this.on("interactionCreate", async interaction => {
			if (!interaction.guild) return;

			const cache = this.getGuildCache(interaction.guild.id);

			if (interaction.isCommand()) {
				const command = this.slashInteractions.get(interaction.commandName);
				if (!command) return;
				
				await interaction.deferReply({ ephemeral: command.ephemeral ?? true }).catch(() => {});

				const helper = new SlashInteractionHelper(interaction, cache);

				if (command.guards) {
					for (const GuardCreator of command.guards) {
						const guard = new GuardCreator();

						const passed = await guard.execute(cache, interaction);

						if (!passed) {
							await helper.respond(Embeds.forBad(guard.message));
							logger.info(`[SLASH_COMMAND_GUARD_FAIL]:\n(${guard.name}): ${guard.message}`);
							return;
						}

						logger.info(`[SLASH_COMMAND_GUARD_PASS] ${interaction.guild.name}`);
					}
				}

				try {
					await command.execute(helper);
					logger.info(`[SLASH_COMMAND_EXECUTE_PASS]: ${command.builder.name}`);
				} catch (err) {
					await helper
						.respond(Embeds.forBad(`There was an error executing this command!`))
						.catch(err =>
							logger.error(
								`[SLASH_COMMAND_EXECUTE_FAIL]:\nName: ${command.builder.name}\nDescription: ${command.builder.description}\nError: ${err.message}`
							)
						);
				}

				return;
			}

			if (interaction.isButton()) {
				const button = this.buttonInteractions.get(interaction.customId);
				if (!button) return;

				const helper = new ButtonHelper(interaction, cache);

				try {
					await button.execute(helper);
					logger.info(`[BUTTON_EXECUTE_PASS]: ${button.id}`);
				} catch (err) {
					await helper
						.update({
							embeds: [Embeds.forBad(`There was an error executing this button!`)],
							components: [],
						})
						.catch(err =>
							logger.error(`[BUTTON_EXECUTE_FAIL]:\nID: ${button.id} Error: ${err.message}`)
						);
				}

				return;
			}

			if (interaction.isSelectMenu()) {
				const menu = this.selectMenuInteractions.get(interaction.customId);

				if (!menu) return;

				const helper = new SelectMenuInteractionHelper(interaction, cache);

				try {
					await menu.execute(helper);
					logger.info(`[MENU_EXECUTE_PASS]: '${menu.id}'`);
				} catch (err) {
					await helper
						.update({
							embeds: [Embeds.forBad(`There was an error executing this menu!`)],
							components: [],
						})
						.catch(err => console.log(err));
					logger.error(`[MENU_EXECUTE_FAIL]: \nID: '${menu.id}' Error: ${(err as Error)}`);
				}

				return;
			}

			if (interaction.isContextMenu()) {
				const menu = this.contextMenuInteractions.get(interaction.commandName);
				if (!menu) return;

				await interaction.deferReply({ ephemeral: menu.ephemeral ?? true }).catch(() => {});

				const helper = new ContextMenuInteractionHelper(interaction, cache);

				if (menu.type === "client" && interaction.targetId !== this.user!.id) {
					await helper.respond("This command can only be used on the bot!");
					return;
				}

				try {
					await menu.execute(helper);
				} catch (err) {
					await helper
						.respond({
							embeds: [Embeds.forBad(`There was an error executing this command!`)],
						})
						.catch(() => {});
					logger.error(
						`[CONTEXT_COMMAND_EXECUTE_FAIL]: \nID: ${menu.name} Error: ${(err as Error).message}`
					);
				}
				return;
			}
		});

		this.on("messageCreate", async message => {
			if (message.author.bot) return;
			if (message.webhookId) return;
			if (!message.guild) return;

			const channel = message.channel;
			const cache = this.getGuildCache(message.guildId!);

			if (channel.isText()) {
				const args = message.content.trim().split(/\s+/);

				// message doesn't start with guild prefix
				if (args[0].slice(0, cache.prefix.length) !== cache.prefix) {
					return;
				}

				const commandName = args[0].slice(cache.prefix.length);
				const command = this.messageInteractions.get(commandName);

				await channel.sendTyping();

				if (!command) {
					await message.reply({
						embeds: [
							Embeds.forBad(`Command not found! Use ${cache.prefix}help to view all commands.`),
						],
					});
					return;
				}

				if (command.guards) {
					for (const GuardCreator of command.guards) {
						const guard = new GuardCreator();

						const passed = await guard.execute(cache, message);

						if (!passed) {
							await message.reply({ embeds: [Embeds.forBad(guard.message)] });
							logger.info(`[MESSAGE_COMMAND_GUARD_FAIL]:\n(${guard.name}): ${guard.message}`);
							return;
						}

						logger.info(`[MESSAGE_COMMAND_GUARD_PASS] ${message.guild!.name}`);
					}
				}

				const [errors, options] = command.builder.validate(message);

				if (errors) {
					logger.info(`[MESSAGE_COMMAND_VALIDATE_FAIL]:\nErrors: ${errors.map(e => e.type)}`);
					await message.reply({ embeds: [Embeds.forProperUsage(command.builder)] }).catch(() => {});
					return;
				}

				const helper = new MessageInteractionHelper(message, cache, options);

				try {
					await command.execute(helper);
					logger.info(`[MESSAGE_COMMAND_EXECUTE_PASS]: ${command.builder.name}`);
				} catch (err) {
					logger.error(
						`[MESSAGE_COMMAND_EXECUTE_FAIL]:\nName: ${command.builder.name}\nDescription: ${
							command.builder.description
						}\nError: ${(err as Error).message}`
					);
				}
			}
		});

		this.on("threadCreate", async thread => {
			logger.info(`[THREAD_CREATE]: ${thread.id}`);
		});

		this.on("guildDelete", async guild => {
			await this.deleteGuildCache(guild.id);
			logger.info(`Removed from guild: ${guild.name}`);
		});
	}

	private setSlashCommandInteractions() {
		const folder = path.join(__dirname, `./interactions/commands/slash`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as SlashCommandData;
			this.slashInteractions.set(data.builder.name, data);
		}

		logger.info("Slash command interactions loaded");
	}

	private setButtonInteractions() {
		const folder = path.join(__dirname, `./interactions/buttons`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as ButtonData;
			this.buttonInteractions.set(data.id, data);
		}

		logger.info("Button interactions loaded");
	}

	private setSelectMenuInteractions() {
		const folder = path.join(__dirname, `./interactions/select-menus`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as SelectMenuData;
			this.selectMenuInteractions.set(data.id, data);
		}

		logger.info("Select menu interactions loaded");
	}

	private setContextMenuInteractions() {
		const folder = path.join(__dirname, `./interactions/context-menu`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as ContextMenuData;
			this.contextMenuInteractions.set(data.name, data);
		}

		logger.info("Context menu interactions loaded");
	}

	private setMessageCommands() {
		const folder = path.join(__dirname, `./interactions/commands/message`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as MessageCommandData;

			if (this.messageInteractions.has(data.builder.name)) {
				throw new Error(`Duplicate message command name: ${data.builder.name}`);
			}

			this.messageInteractions.set(data.builder.name, data);

			for (const alias of data.builder.aliases) {
				if (this.messageInteractions.has(alias)) {
					throw new Error(`Duplicate message command alias: ${alias}`);
				}

				this.messageInteractions.set(alias, data);
			}
		}

		logger.info("Message command interactions loaded");
	}

	private isFile(file: string) {
		return file.endsWith(`.ts`) || file.endsWith(`.js`);
	}

	private getGuildCache(id: string) {
		return this.guildCaches.get(id)!;
	}

	private async createGuildCache(guild: Guild) {
		const prefix = await this.db.getPrefix(guild.id);
		const cache = new GuildCache(this, this.db, guild, prefix);
		this.guildCaches.set(guild.id, cache);
		return cache;
	}

	private async deleteGuildCache(guildId: string) {
		await this.db.eraseGuild(guildId);
		this.guildCaches.delete(guildId);
	}
}
