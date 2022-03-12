import 'dotenv/config';

import { Client, Collection, MessageEmbed } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

import config from '../config.json';
import BotCache from './app/BotCache';
import { ButtonHelper } from './helpers/ButtonHelper';
import { MenuHelper } from './helpers/MenuHelper';
import { MessageCommandHelper } from './helpers/MessageCommandHelper';
import { SlashCommandHelper } from './helpers/SlashCommandHelper';
import { ButtonData, MenuData, MessageCommandData, SlashCommandData } from './types/data';
import { getProperUsageEmbed } from './utils/getProperUsageEmbed';
import { logger } from './utils/logger';
import { MessageCommandValidator } from './utils/MessageCommandValidator';
import { SlashCommandDeployer } from './utils/SlashCommandDeployer';

export default class Bot {
	private readonly bot: Client;
	public readonly botCache: BotCache;
	public readonly slashCommandFiles: Collection<string, SlashCommandData>;
	public readonly buttonFiles: Collection<string, ButtonData>;
	public readonly menuFiles: Collection<string, MenuData>;
	public readonly messageCommandFiles: Collection<string, MessageCommandData>;

	public constructor() {
		this.bot = new Client({
			intents: ["GUILD_MESSAGES", "GUILDS"],
		});
		this.botCache = new BotCache(this.bot);
		this.slashCommandFiles = new Collection();
		this.buttonFiles = new Collection();
		this.menuFiles = new Collection();
		this.messageCommandFiles = new Collection();
	}

	/**
	 * Initialise bot events and interaction/message commands
	 */
	public initialise() {
		this.registerSlashCommandInteractions();
		this.registerMessageCommands();
		this.registerClientEvents();

		//TODO: replace with env var
		void this.bot.login(config.bot_token);
	}

	private registerClientEvents() {
		this.bot.on("ready", async bot => {
			const guilds = bot.guilds.cache.toJSON();

			for (const guild of guilds) {
				try {
					await SlashCommandDeployer.deploy(guild.id, this.slashCommandFiles);
				} catch (err) {
					console.error(
						`❌ Failed to deploy slash commands in ${guild.name}: ${(err as Error).message}`
					);
				}

				console.log(`✅ Deployed slash commands in ${guild.name}`);
			}

			logger.info(`${bot.user.tag} is ready!`);
		});

		this.bot.on("error", error => console.error(`❗ Bot Error: ${error.message}`));

		this.bot.on("interactionCreate", async interaction => {
			const guildCache = await this.botCache.getGuildCache(interaction.guild!);

			if (interaction.isCommand()) {
				const command = this.slashCommandFiles.get(interaction.commandName);
				if (!command) return;

				logger.info(`[SLASH]: ${command.builder.name}`);

				await interaction
					.deferReply({
						ephemeral: command.ephemeral ?? true,
					})
					.catch(err => logger.warn(`Could not defer reply: ${err.message}`));

				const helper = new SlashCommandHelper(interaction, guildCache);

				if (command.guard) {
					try {
						await command.guard.test(helper);
					} catch (err) {
						await command.guard.fail(err as Error, helper);
						logger.info(`Slash command guard failed: ${(err as Error).message}`);
						return;
					}
				}

				try {
					await command.execute(helper);
				} catch (err) {
					logger.error(
						`Failed to execute command:\nName: ${command.builder.name}\nDescription: ${command.builder.description}`
					);
				}
			}

			if (interaction.isButton()) {
				const button = this.buttonFiles.get(interaction.customId);
				if (!button) return;

				logger.info(`[BUTTON]: ${button.id}`);

				const helper = new ButtonHelper(interaction, guildCache);

				try {
					await button.execute(helper);
				} catch (err) {
					await helper
						.update({
							content: `❌ There was an error executing this button!`,
							components: [],
						})
						.catch(err =>
							logger.error(`Failed to execute button:\nID: ${button.id} Error: ${err.message}`)
						);
				}
			}

			if (interaction.isSelectMenu()) {
				const menu = this.menuFiles.get(interaction.customId);
				if (!menu) return;

				logger.info(`[MENU]: ${menu.id}`);

				const helper = new MenuHelper(interaction, guildCache);

				try {
					await menu.execute(helper);
				} catch (err) {
					await helper
						.update({
							content: `❌ There was an error executing this menu!`,
							components: [],
						})
						.catch(err =>
							logger.error(`Could execute menu:\nID: ${menu.id} Error: ${err.message}`)
						);
				}
			}
		});

		this.bot.on("messageCreate", async message => {
			if (message.author.bot) return;

			const cache = await this.botCache.getGuildCache(message.guild!);

			/**
			 * Doesn't type guard but good to assert anyway
			 */
			if (message.channel.isText()) {
				await message.channel.sendTyping();

				const options = message.content.split(/\s+/);
				const command = this.messageCommandFiles.get(options[0].replace(cache.messagePrefix, ""));

				if (!command) return;

				logger.info(`[MESSAGE]: ${command.builder.name}`);

				if (!MessageCommandValidator.validatePrefix(cache.messagePrefix, options[0])) return;
				if (!MessageCommandValidator.validateOptions(command.builder.options, options.slice(1))) {
					await message
						.reply({ embeds: [getProperUsageEmbed(command.builder)] })
						.catch(err => logger.warn(`Could not reply to message: ${err.message}`));
					return;
				}

				const helper = new MessageCommandHelper(message, cache);

				if (command.guard) {
					try {
						await command.guard.test(helper);
					} catch (err) {
						await command.guard.fail(err as Error, helper);
						await message
							.delete()
							.catch(err => logger.warn(`Could not delete message: ${err.message}`));
						return;
					}
				}

				try {
					await command.execute(helper);
					await message
						.delete()
						.catch(err => logger.warn(`Could not delete message: ${err.message}`));
				} catch (err) {
					logger.error(
						`Failed to execute message command:\nName: ${command.builder.name}\nDescription: ${command.builder.description}`
					);
				}
			}
		});

		this.bot.on("guildDelete", async guild => {
			logger.info(`Removed from guild: ${guild.name}`);
		});
	}

	private registerSlashCommandInteractions() {
		const commandDir = path.join(__dirname, `./commands/slash`);
		const commandNames = fs.readdirSync(commandDir).filter(this.isFile);

		for (const commandName of commandNames) {
			const commandData = require(path.join(commandDir, commandName)) as SlashCommandData;
			this.slashCommandFiles.set(commandData.builder.name, commandData);
		}
	}

	private registerMessageCommands() {
		const folder = path.join(__dirname, `./commands/message`);
		const names = fs.readdirSync(folder).filter(this.isFile);

		for (const name of names) {
			const data = require(path.join(folder, name)) as MessageCommandData;
			this.messageCommandFiles.set(data.builder.name, data);
		}
	}

	private isFile(file: string) {
		return file.endsWith(`.ts`) || file.endsWith(`.js`);
	}
}
