import { MessageEmbed } from "discord.js";
import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../typings/interactions";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder().setName("ping").setDescription("Displays the latency of the bot."),

	execute: async helper => {
		await helper.respond(
			new MessageEmbed()
				.setAuthor({ name: `🕕  Pong! ${helper.interaction.client.ws.ping}ms` })
				.setColor("GOLD")
		);
	},
};

module.exports = command;
