import { MessageEmbed } from "discord.js";
import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../typings/interactions";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("playlist-create")
		.setDescription("Create your own customised playlist.")
		.setAliases(["plc", "playlist-new"])
		.addStringOption(option =>
			option.setName("playlist-name").setDescription("The name of the playlist.")
		),

	execute: async helper => {
		const member = helper.interaction.member!;
		const channel = helper.interaction.channel;
		const [playlistName] = helper.options as [string];

		try {
			await helper.cache.db.createPlaylist(member.id, playlistName);
		} catch (err) {}

		await channel.send({
			embeds: [
				new MessageEmbed().setAuthor({
					name: `✅  Created '${playlistName}' successfully!`,
				}),
			],
		});
	},
};

module.exports = command;
