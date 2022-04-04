import { MessageActionRow, MessageSelectMenu } from "discord.js";

import { Track } from "../../types/track";
import { Utils } from "../Utils";


type MenuComponents = Readonly<Record<`for${string}`, (...args: any[]) => MessageSelectMenu>>;

export const Menus: MenuComponents = {
	forTrackSelection: (tracks: Track[]) =>
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
};
