import { GuildMember, MessageActionRow, MessageEmbed } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

import { SlashCommandData } from "../../../typings/interactions";
import { Menus } from "../../../utils/components/Menus";


const command: SlashCommandData = {
	builder: new SlashCommandBuilder().setName("menu-tests").setDescription("testing for menu"),

	execute: async helper => {
		const query = "enemy";

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
