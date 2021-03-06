import { SlashCommandBuilder } from "@discordjs/builders";

import { SlashCommandData } from "../../../typings/interactions";


const command: SlashCommandData = {
	builder: new SlashCommandBuilder().setName("help").setDescription("Displays this help message."),

	execute: async helper => {
		await helper.respond("Hello World!");
	},
};

module.exports = command;
