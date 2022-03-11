import { SlashCommandBuilder } from '@discordjs/builders';

import { MessageCommandData, SlashCommandData } from '../../types';

const command: SlashCommandData = {
	builder: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Displays this help message."),

	execute: async helper => {
		await helper.respond("Hello World!")
	},
};

module.exports = command;
