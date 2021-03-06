import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../typings/interactions";
import { BotNeedsVoiceConnection } from "../../../utils/guards/BotNeedsVoiceConnection";
import { BotVoiceChannelOnly } from "../../../utils/guards/BotVoiceChannelOnly";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("queue")
		.setDescription("Shows the current queue.")
		.setAliases(["q"])
		.addNumberOption(option => option.setName("page").setDescription("Page number")),

	guards: [BotVoiceChannelOnly, BotNeedsVoiceConnection],

	execute: async helper => {},
};

module.exports = command;
