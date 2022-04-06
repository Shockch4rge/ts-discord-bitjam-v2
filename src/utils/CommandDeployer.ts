import "dotenv/config";

import { ApplicationCommandType, Routes } from "discord-api-types/v9";
import { Collection } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";

import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";

import config from "../../config.json";
import { ContextMenuData, SlashCommandData } from "../typings/interactions";


export class SlashCommandDeployer {
	public static async deploy(guildId: string, slashCommandFiles: Collection<string, SlashCommandData>, contextMenuFiles: Collection<string, ContextMenuData>) {
		// TODO: replace with env var
		const rest = new REST({ version: "9" }).setToken(config.bot_token);

		//TODO: replace with env var
		const route = Routes.applicationGuildCommands(config.app_id, guildId);

		await rest.put(route, {
			body: slashCommandFiles.map(command => command.builder.toJSON()),
		});

		await rest.put(route, {
			body: contextMenuFiles.map(menu => {
				const builder = new ContextMenuCommandBuilder();
				builder.setName(menu.name)

				switch (menu.type) {
					case "user":
					case "client": {
						builder.setType(3)
					}
					case "message": {
						builder.setType(2)
					}
				}

				return builder.toJSON();
			})
		})
	}
}
