import { MessageEmbed } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

import { SlashCommandData } from "../../../types/interactions";
import { BotVoiceChannelOnly } from "../../../utils/guards/BotVoiceChannelOnly";


const command: SlashCommandData = {
	builder: new SlashCommandBuilder().setName("ping").setDescription("Get the latency of the bot."),

	execute: async helper => {
		await helper.respond(
			new MessageEmbed().setAuthor({ name: `🕕 Pong! ${helper.cache.bot.ws.ping}ms` }).setColor("AQUA")
		);
	},
};

module.exports = command;
