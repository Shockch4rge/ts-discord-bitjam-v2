import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../typings/interactions";


const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("playlist-add")
		.setDescription("Add a song to one of your customised playlists.")
		.setAliases(["pla"]),

	execute: async helper => {
	},
};

module.exports = command;
