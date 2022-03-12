import { DiscordGatewayAdapterCreator, joinVoiceChannel } from '@discordjs/voice';

import { MessageCommandData } from '../../types/data';
import { MessageCommandBuilder } from '../../utils/MessageCommandBuilder';

const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("play")
		.setDescription("Plays a search query, or a YouTube/Spotify URL.")
		.setAliases(["p"])
		.addOption<string>(option =>
			option.setName("query").setDescription("A search query or a YouTube/Spotify URL.")
		),

	execute: async helper => {
		const service = helper.cache.service;
		const connection = service.createConnection(helper.message.member!);

		const [commandName, query] = helper.options;
	},
};

module.exports = command;
