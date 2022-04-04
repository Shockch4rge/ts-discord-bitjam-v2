import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../types/interactions";
import { BotNeedsVoiceConnection } from "../../../utils/guards/BotNeedsVoiceConnection";
import { BotVoiceChannelOnly } from "../../../utils/guards/BotVoiceChannelOnly";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("queue")
		.setDescription("Shows the current queue.")
		.setAliases(["q"])
		.addNumberOption(option => option.setName("page").setDescription("Page number")),

	guards: [new BotVoiceChannelOnly(), new BotNeedsVoiceConnection()],

	execute: async helper => {
	},
};

module.exports = command;
