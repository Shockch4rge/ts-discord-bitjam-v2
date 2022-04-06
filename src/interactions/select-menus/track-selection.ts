import { SelectMenuData } from "../../typings/interactions";


const menu: SelectMenuData = {
	id: "track-selection",

	execute: async helper => {
		const trackUrls = helper.interaction.values;
	},
};

module.exports = menu;
