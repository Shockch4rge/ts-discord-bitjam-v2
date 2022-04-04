import { MessageEmbed } from "discord.js";
import { MessageCommandBuilder } from "djs-message-commands";

import { formatEmoji } from "@discordjs/builders";

import { MessageCommandData } from "../../../types/interactions";
import { Embeds } from "../../../utils/components/Embeds";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("playlist-create")
        .setDescription("Create your own customised playlist.")
        .setAliases(["plc", "playlist-new"])
        .addStringOption(option =>
            option
                .setName("playlist-name")
                .setDescription("The name of the playlist.")),
    
	execute: async helper => {
		const member = helper.message.member!;
		const channel = helper.message.channel;
        const [playlistName] = helper.options as [string];

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
