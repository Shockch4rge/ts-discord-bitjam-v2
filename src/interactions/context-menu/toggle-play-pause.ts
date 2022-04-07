import { ContextMenuData } from "../../typings/interactions";
import { Embeds } from "../../utils/components/Embeds";


const menu: ContextMenuData = {
	name: "Toggle Play or Pause",
	description: "Toggles the player between playing and paused.",
	type: "client",	

	execute: async helper => {
		await helper.respond(Embeds.forGood("Toggled!"))
	},
};

module.exports = menu;
