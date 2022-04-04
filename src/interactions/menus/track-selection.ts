import { MenuData } from '../../types/interactions';

const menu: MenuData = {
	id: "track-selection",

	execute: async helper => {
		const trackUrls = helper.interaction.values;
	},
};

module.exports = menu;
