import { MessageEmbed } from "discord.js";
import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../types/interactions";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("set-prefix")
		.setDescription("Sets the prefix for the bot.")
		.setAliases(["sp"])
		.addStringOption(option =>
			option.setName("prefix").setDescription("The prefix to set for all message commands")
		),

	execute: async helper => {
		const channel = helper.message.channel;
		const [prefix] = helper.options as [string];

		await helper.cache.setPrefix(prefix);
		await channel.send({
			embeds: [new MessageEmbed().setAuthor({ name: `✅  Set message command prefix to '${prefix}'` })],
		});
	},
};

module.exports = command;
