import 'dotenv/config';

import { Routes } from 'discord-api-types/v9';
import { Collection } from 'discord.js';

import { REST } from '@discordjs/rest';

import config from '../../config.json';
import { SlashCommandData } from '../types';

export class SlashCommandDeployer {
	public static async deploy(guildId: string, slashCommandFiles: Collection<string, SlashCommandData>) {
		// TODO: replace with env var
		const rest = new REST({ version: "9" }).setToken(config.bot_token);

		//TODO: replace with env var
		const route = Routes.applicationGuildCommands(config.app_id, guildId);

		await rest.put(route, {
			body: slashCommandFiles.map(command => command.builder.toJSON()),
		});
	}
}
