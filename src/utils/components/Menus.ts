import { MessageActionRow, MessageSelectMenu } from "discord.js";

import { Track } from "../../typings/track";
import { Utils } from "../Utils";


export const Menus = {
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
