import { ApplicationCommandType } from "discord-api-types/v9";

import { ContextMenuCommandBuilder, ContextMenuCommandType } from "@discordjs/builders";

import { ContextMenuData } from "../../../typings/interactions";


const menu: ContextMenuData = {
	name: "test-context",

	type: "client",

	execute: async helper => {
		await helper.respond("Hello this worked");
	},
};

module.exports = menu;
