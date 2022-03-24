import { MessageActionRow, MessageSelectMenu } from "discord.js";

import { Track } from "../../types/track";
import { Utils } from "../Utils";


type MenuComponents = Readonly<Record<string, (...args: any[]) => MessageActionRow>>

export const Menus: MenuComponents = {
	trackSelection: (tracks: Track[]) => {
		return new MessageActionRow().addComponents([
			new MessageSelectMenu()
				.setCustomId("track-selection")
				.setPlaceholder("Select tracks to add to the queue!")
				.setMinValues(1)
				.addOptions(
					tracks.map((track, i) => ({
						label: track.title,
						value: track.trackUrl,
						emoji: Utils.TEXT.EMOJIS.NUMBERS[i + 1],
					}))
				),
		]);
	},
};
