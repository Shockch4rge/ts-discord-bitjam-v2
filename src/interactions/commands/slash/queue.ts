import { SlashCommandBuilder } from "@discordjs/builders";

import { SlashCommandData } from "../../../typings/interactions";


const command: SlashCommandData = {
	builder: new SlashCommandBuilder().setName("queue").setDescription("Shows the current queue."),

	execute: async helper => {},
};

module.exports = command;
