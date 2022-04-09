import { MessageButton } from "discord.js";


export const Buttons = {
	backPage: () => new MessageButton().setCustomId("back-page").setStyle("PRIMARY").setEmoji("⬅️"),

	nextPage: () => new MessageButton().setCustomId("next-page").setStyle("PRIMARY").setEmoji("➡️"),
};
