import { MessageEmbed } from 'discord.js';

import { MessageCommandData } from '../../types/data';
import { MessageCommandBuilder } from '../../utils/MessageCommandBuilder';

const command: MessageCommandData = {
	builder: new MessageCommandBuilder().setName("ping").setDescription("Displays the latency of the bot."),

	execute: async helper => {
		await helper.respond(
			new MessageEmbed()
				.setAuthor({ name: `🕕  Pong! ${helper.message.client.ws.ping}ms` })
				.setColor("GOLD")
		);
	},
};

module.exports = command;
