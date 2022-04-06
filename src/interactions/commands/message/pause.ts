import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../typings/interactions";
import { BotNeedsVoiceConnection } from "../../../utils/guards/BotNeedsVoiceConnection";
import { BotVoiceChannelOnly } from "../../../utils/guards/BotVoiceChannelOnly";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder().setName("pause").setDescription("Pause the current song."),

	guards: [BotNeedsVoiceConnection, BotVoiceChannelOnly],

	execute: async helper => {
		await helper.respond("Pausing the current song...");

		await helper.editReply("Paused!");
	},
};

module.exports = command;
