import { MessageEmbed } from "discord.js";
import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../typings/interactions";
import { Embeds } from "../../../utils/components/Embeds";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("playlist-delete")
		.setDescription("Deletes a playlist.")
		.setAliases(["pld", "playlist-remove"]),

	execute: async helper => {
		const member = helper.interaction.member!;

		const playlists = await helper.cache.db.getUserPlaylists(member.id);

		if (!playlists) {
			await helper.respond(Embeds.forBad(`You don't have any playlists!`));
			return;
		}

		await helper.respond(
			new MessageEmbed()
				.setAuthor({ name: `Select a playlist to delete from the list below:` })
				.setFields(
					playlists.map(playlist => ({
						name: `${playlist.name}`,
						value: `${playlist.name}`,
					}))
				)
		);
	},
};

module.exports = command;
