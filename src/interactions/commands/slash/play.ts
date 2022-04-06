import { GuildMember, MessageActionRow, MessageEmbed } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

import { SlashCommandData } from "../../../typings/interactions";
import { Menus } from "../../../utils/components/Menus";


const command: SlashCommandData = {
	builder: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Plays a search query, or a Spotify/YouTube URL.")
		.addStringOption(option =>
			option.setName("query").setDescription("The query to search for.").setRequired(true)
		),

	execute: async helper => {
		const query = helper.string("query")!;

		const member = helper.interaction.member! as GuildMember;
		const service = helper.cache.music;

		// service.createConnection(member);

		const tracks = await service.tracks.searchYoutubeQuery(query);

		await helper.respond({
			embeds: [new MessageEmbed().setTitle("hi")],
			components: [new MessageActionRow().addComponents(Menus.forTrackSelection(tracks))],
		});
	},
};

module.exports = command;
