import { Client, Collection } from "discord.js";
import fs from "node:fs";
import path from "node:path";

import config from "../config.json";
import BotCache from "./app/BotCache";
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
import { Utils } from "./utils/Utils";


export default class Bot {
	private readonly bot: Client;
	public readonly cache: BotCache;
	public readonly slashCommandFiles: Collection<string, SlashCommandData>;
	public readonly buttonFiles: Collection<string, ButtonData>;
	public readonly selectMenuFiles: Collection<string, SelectMenuData>;
	public readonly messageCommandFiles: Collection<string, MessageCommandData>;
	public readonly contextMenuFiles: Collection<string, ContextMenuData>;

	public constructor() {
		this.bot = new Client({
			intents: ["GUILD_MESSAGES", "GUILDS"],
		});
		this.cache = new BotCache(this.bot);
		this.slashCommandFiles = new Collection();
		this.buttonFiles = new Collection();
		this.selectMenuFiles = new Collection();
		this.messageCommandFiles = new Collection();
		this.contextMenuFiles = new Collection();
	}

	public initialise() {
		this.setSlashCommandInteractions();
		this.setSelectMenuInteractions();
		this.setContextMenuInteractions();
		this.setMessageCommands();
		this.registerClientEvents();

		//TODO: replace with env var
		void this.bot.login(config.bot_token);
	}

	private registerClientEvents() {
		this.bot.once("ready", async bot => {
			const guilds = bot.guilds.cache.toJSON();

			for (const guild of guilds) {
				try {
					await this.cache.createGuildCache(guild);
				} catch (err) {
					logger.error(`Couldn't find ${guild.name}`);
				}

				try {
					await CommandDeployer.deploy(guild.id, this.slashCommandFiles, this.contextMenuFiles);
				} catch (err) {
					logger.error(`[COMMAND_DEPLOY_FAIL] ${guild.name}: ${(err as Error).message}`);
				}

				logger.info(`✅ Deployed commands in ${guild.name}`);

				guild.me!.setNickname("⏱ BitJam | Idle");
			}

			this.bot.user!.setActivity({
				type: "LISTENING",
				name: "to /help",
			});
			logger.info(`${bot.user.tag} is ready!`);
		});

		this.bot.on("error", error => {
			logger.error(`[CLIENT_ERROR]: ${error.message}`);
		});

		this.bot.on("interactionCreate", async interaction => {
			const cache = this.cache.getGuildCache(interaction.guildId!);

			if (interaction.isCommand()) {
				const command = this.slashCommandFiles.get(interaction.commandName);
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

						logger.info(`[SLASH_COMMAND_GUARD_PASS] ${interaction.guild!.name}`);
					}
				}

				try {
					await command.execute(helper);
					logger.info(`[SLASH_COMMAND_EXECUTE_PASS]: ${command.builder.name}`);
				} catch (err) {
					logger.error(
						`[SLASH_COMMAND_EXECUTE_FAIL]:\nName: ${command.builder.name}\nDescription: ${command.builder.description}`
					);
				}

				return;
			}

			if (interaction.isButton()) {
				const button = this.buttonFiles.get(interaction.customId);
				if (!button) return;

				const helper = new ButtonHelper(interaction, cache);

				try {
					await button.execute(helper);
					logger.info(`[BUTTON_EXECUTE_PASS]: ${button.id}`);
				} catch (err) {
					await helper
						.update({
							content: `❌ There was an error executing this button!`,
							components: [],
						})
						.catch(err =>
							logger.error(`[BUTTON_EXECUTE_ERROR]:\nID: ${button.id} Error: ${err.message}`)
						);
				}

				return;
			}

			if (interaction.isSelectMenu()) {
				const menu = this.selectMenuFiles.get(interaction.customId);
				if (!menu) return;

				const helper = new SelectMenuInteractionHelper(interaction, cache);

				try {
					await menu.execute(helper);
					logger.info(`[MENU_EXECUTE_PASS]: ${menu.id}`);
				} catch (err) {
					await helper
						.update({
							content: `❌ There was an error executing this menu!`,
							components: [],
						})
						.catch(() => {});
					logger.error(`[MENU_EXECUTE_FAIL]: \nID: ${menu.id} Error: ${(err as Error).message}`);
				}

				return;
			}

			if (interaction.isContextMenu()) {
				const menu = this.contextMenuFiles.get(interaction.commandName);
				if (!menu) return;

				await interaction.deferReply({ ephemeral: menu.ephemeral ?? true }).catch(() => {});

				const helper = new ContextMenuInteractionHelper(interaction, cache);

				if (menu.type === "client" && interaction.targetId !== this.bot.user!.id) {
					await helper.respond("This command can only be used on the bot!");
					return;
				}

				await menu.execute(helper);
				return;
			}
		});

		this.bot.on("messageCreate", async message => {
			if (message.author.bot) return;
			if (message.webhookId) return;
			if (!message.guild) return;

			const channel = message.channel;
			const cache = this.cache.getGuildCache(message.guildId!);

			if (channel.isText()) {
				const args = message.content.trim().split(/\s+/);

				// message doesn't start with guild prefix
				if (args[0].slice(0, cache.prefix.length) !== cache.prefix) {
					return;
				}

				const commandName = args[0].slice(cache.prefix.length);
				const command = this.messageCommandFiles.get(commandName);

				await channel.sendTyping();

				if (!command) {
					const warning = await message.reply({
						embeds: [
							Embeds.forBad(`Command not found! Use ${cache.prefix}help to view all commands.`),
						],
					});
					await Utils.delay(5000);
					await warning.delete().catch(() => {});
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

		this.bot.on("guildDelete", async guild => {
			logger.info(`Removed from guild: ${guild.name}`);
		});
	}

	private setSlashCommandInteractions() {
		const folder = path.join(__dirname, `./interactions/commands/slash`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as SlashCommandData;
			this.slashCommandFiles.set(data.builder.name, data);
		}

		logger.info("Slash command interactions loaded");
	}

	private setSelectMenuInteractions() {
		const folder = path.join(__dirname, `./interactions/select-menus`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as SelectMenuData;
			this.selectMenuFiles.set(data.id, data);
		}

		logger.info("Select menu interactions loaded");
	}

	private setContextMenuInteractions() {
		const folder = path.join(__dirname, `./interactions/context-menu`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as ContextMenuData;
			this.contextMenuFiles.set(data.name, data);
		}

		logger.info("Context menu interactions loaded");
	}

	private setMessageCommands() {
		const folder = path.join(__dirname, `./interactions/commands/message`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as MessageCommandData;

			if (this.messageCommandFiles.has(data.builder.name)) {
				throw new Error(`Duplicate message command name: ${data.builder.name}`);
			}

			this.messageCommandFiles.set(data.builder.name, data);

			for (const alias of data.builder.aliases) {
				if (this.messageCommandFiles.has(alias)) {
					throw new Error(`Duplicate message command alias: ${alias}`);
				}

				this.messageCommandFiles.set(alias, data);
			}
		}

		logger.info("Message command interactions loaded");
	}

	private isFile(file: string) {
		return file.endsWith(`.ts`) || file.endsWith(`.js`);
	}
}
