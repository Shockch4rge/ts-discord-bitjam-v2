import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../types/interactions";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("queue")
		.setDescription("Shows the current queue.")
		.setAliases(["q"])
		.addNumberOption(option => option.setName("page").setDescription("Page number")),

	execute: async helper => {
		helper.cache
	},
};

module.exports = command;
