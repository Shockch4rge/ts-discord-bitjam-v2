import "dotenv/config";

import { Client, Collection } from "discord.js";
import fs from "node:fs";
import path from "node:path";

import config from "../config.json";
import BotCache from "./app/BotCache";
import GuildCache from "./app/GuildCache";
import { ButtonHelper } from "./helpers/ButtonHelper";
import { MenuHelper } from "./helpers/MenuHelper";
import { MessageCommandHelper } from "./helpers/MessageCommandHelper";
import { SlashCommandHelper } from "./helpers/SlashCommandHelper";
import { ButtonData, MenuData, MessageCommandData, SlashCommandData } from "./types/interactions";
import { Embeds } from "./utils/components/Embeds";
import { logger } from "./utils/logger";
import { SlashCommandDeployer } from "./utils/SlashCommandDeployer";
import { Utils } from "./utils/Utils";


export default class Bot {
	private readonly bot: Client;
	public readonly cache: BotCache;
	public readonly slashCommandFiles: Collection<string, SlashCommandData>;
	public readonly buttonFiles: Collection<string, ButtonData>;
	public readonly menuFiles: Collection<string, MenuData>;
	public readonly messageCommandFiles: Collection<string, MessageCommandData>;

	public constructor() {
		this.bot = new Client({
			intents: ["GUILD_MESSAGES", "GUILDS"],
		});
		this.cache = new BotCache(this.bot);
		this.slashCommandFiles = new Collection();
		this.buttonFiles = new Collection();
		this.menuFiles = new Collection();
		this.messageCommandFiles = new Collection();
	}

	/**
	 * Initialise bot events and interaction/message commands
	 */
	public initialise() {
		this.saveSlashCommandInteractions();
		this.saveMenuInteractions();
		this.saveMessageCommands();
		this.registerClientEvents();

		//TODO: replace with env var
		void this.bot.login(config.bot_token);
	}

	private registerClientEvents() {
		this.bot.on("ready", async bot => {
			const guilds = bot.guilds.cache.toJSON();

			for (const guild of guilds) {
				let cache: GuildCache;

				try {
					cache = await this.cache.getGuildCache(guild);
				} catch (err) {
					logger.error(`Couldn't find ${guild.name}`);
				}

				try {
					await SlashCommandDeployer.deploy(guild.id, this.slashCommandFiles);
				} catch (err) {
					logger.error(`[SLASH_COMMAND_DEPLOY_FAIL] ${guild.name}: ${(err as Error).message}`);
				}

				logger.info(`✅ Deployed slash commands in ${guild.name}`);

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
			const cache = await this.cache.getGuildCache(interaction.guild!);

			if (interaction.isCommand()) {
				const command = this.slashCommandFiles.get(interaction.commandName);
				if (!command) return;

				await interaction
					.deferReply({
						ephemeral: command.ephemeral ?? true,
					})
					.catch(() => {});

				const helper = new SlashCommandHelper(interaction, cache);

				// if (command.guard) {
				// 	try {
				// 		await command.guard.test(helper);
				// 		logger.info(`[SLASH_COMMAND_GUARD_PASS] ${interaction.guild!.name}`);
				// 	} catch (err) {
				// 		await command.guard.reject(err as Error, helper);
				// 		logger.info(`[SLASH_COMMAND_GUARD_FAIL]: ${(err as Error).message}`);
				// 		return;
				// 	}
				// }

				if (command.guards) {
					for (const guard of command.guards) {
						const result = await guard.execute(cache, interaction);
						
						if (!result) {
							await interaction.followUp({ embeds: [Embeds.forBad(guard.message)] });
							return;
						}
					}
				}

				try {
					await command.execute(helper);
					logger.info(`[SLASH_COMMAND_EXECUTE]: ${command.builder.name}`);
				} catch (err) {
					logger.error(
						`[SLASH_COMMAND_EXECUTE_ERROR]:\nName: ${command.builder.name}\nDescription: ${command.builder.description}`
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
					logger.info(`[BUTTON_EXECUTE]: ${button.id}`);
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
				const menu = this.menuFiles.get(interaction.customId);
				if (!menu) return;

				const helper = new MenuHelper(interaction, cache);

				try {
					await menu.execute(helper);
					logger.info(`[MENU_EXECUTE]: ${menu.id}`);
				} catch (err) {
					await helper
						.update({
							content: `❌ There was an error executing this menu!`,
							components: [],
						})
						.catch(() => {});
					logger.error(`[MENU_EXECUTE_ERROR]: \nID: ${menu.id} Error: ${(err as Error).message}`);
				}

				return;
			}
		});

		this.bot.on("messageCreate", async message => {
			if (message.author.bot) return;
			if (message.webhookId) return;
			if (!message.guild) return;

			const channel = message.channel;
			const cache = await this.cache.getGuildCache(message.guild);

			if (channel.isText()) {
				const args = message.content.trim().split(/\s+/);

				// message doesn't start with guild prefix
				if (args[0].slice(0, cache.messagePrefix.length) !== cache.messagePrefix) {
					return;
				}

				const commandName = args[0].slice(cache.messagePrefix.length);
				const command = this.messageCommandFiles.get(commandName);

				await channel.sendTyping();

				if (!command) {
					const warning = await message.reply("That command doesn't exist!");
					await Utils.delay(5000);
					await warning.delete().catch(() => {});
					return;
				}

				if (command.guards) {
					for (const guard of command.guards) {
						const result = await guard.execute(cache, message);

						if (!result) {
							await message.reply({ embeds: [Embeds.forBad(guard.message)] });
							return;
						}
					}
				}

				const [errors, options] = command.builder.validate(message);

				if (errors) {
					logger.info(`[MESSAGE_COMMAND_VALIDATE_FAIL]:\nErrors: ${errors.map(e => e.type)}`);
					await message.reply({ embeds: [Embeds.forProperUsage(command.builder)] }).catch(() => {});
					return;
				}

				const helper = new MessageCommandHelper(message, options, cache);

				// if (command.guard) {
				// 	try {
				// 		await command.guard.test(helper);
				// 	} catch (err) {
				// 		await command.guard.reject(err as Error, helper);
				// 		await message.delete().catch(() => {});
				// 		logger.info(`[MESSAGE_COMMAND_REJECT]: ${(err as Error).message}`);
				// 		return;
				// 	}
				// }

				try {
					await command.execute(helper);
					logger.info(`[MESSAGE_COMMAND_EXECUTE]: ${command.builder.name}`);
				} catch (err) {
					logger.error(
						`[MESSAGE_COMMAND_EXECUTE_ERROR]:\nName: ${command.builder.name}\nDescription: ${
							command.builder.description
						}\nError: ${(err as Error).message}`
					);
				}

				return;
			}
		});

		this.bot.on("guildDelete", async guild => {
			logger.info(`Removed from guild: ${guild.name}`);
		});
	}

	private saveSlashCommandInteractions() {
		const folder = path.join(__dirname, `./interactions/commands/slash`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as SlashCommandData;
			this.slashCommandFiles.set(data.builder.name, data);
		}

		logger.info("Slash command interactions loaded");
	}

	private saveMenuInteractions() {
		const folder = path.join(__dirname, `./interactions/menus`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as MenuData;
			this.menuFiles.set(data.id, data);
		}

		logger.info("Menu interactions loaded");
	}

	private saveMessageCommands() {
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

		logger.info("Message commands loaded");
	}

	private isFile(file: string) {
		return file.endsWith(`.ts`) || file.endsWith(`.js`);
	}
}
