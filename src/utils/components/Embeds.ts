import { MessageEmbed } from "discord.js";

import { bold, inlineCode } from "@discordjs/builders";

import { QueueManager } from "../../app/QueueManager";
import { Utils } from "../../utils/Utils";
import { MessageCommandBuilder, MessageCommandOptionChoiceable } from "../package";


type EmbedComponents = Readonly<Record<string, (...args: any[]) => MessageEmbed>>;

export const Embeds: EmbedComponents = {
	properUsage: (builder: MessageCommandBuilder) => {
		const embed = new MessageEmbed()
			.setAuthor({ name: "❌  Invalid arguments provided!" })
			.setTitle("Proper usage:")
			.addFields([
				{
					name: "Name",
					value: `${inlineCode(builder.name)}`,
					inline: true,
				},
				{
					name: "Aliases",
					value: `${inlineCode(builder.aliases.length <= 0 ? "None" : builder.aliases.join(", "))}`,
					inline: true,
				},
				{
					name: "Usage",
					value:
						builder.options.length <= 0
							? "None"
							: `${builder.name} ${builder.options
									.map(option => inlineCode(option.name))
									.join(" ")}`,
					inline: true,
				},
			]);

		embed.addField(Utils.TEXT.EMPTY_CHAR, "__**Arguments**__");
		for (let i = 0; i < builder.options.length; i++) {
			const option = builder.options[i];
			embed.addField(
				`${i + 1})  ${option.name}`,
				`
				${bold("Type:")} ${inlineCode(option.type)}
				${bold("Description:")} ${inlineCode(option.description)}
				${
					option instanceof MessageCommandOptionChoiceable
						? `${bold("Choices:")} ${option.choices
								.map(c => c[1])
								.map(v => inlineCode(v))
								.join(", ")}`
						: ""
				}
				`
			);
		}

		embed.setFooter({ text: "If you need help or a command isn't working, ping me." });
		embed.setColor("RED");

		return embed;
	},

	queue: (queue: QueueManager) => {
		const embed = new MessageEmbed();
		const length = queue.tracks.length;
		const currentTrack = queue.get(0);

		if (length > 1) {
			embed.addField(`___`, Utils.TEXT.EMPTY_CHAR);

			// append tracks top down from newest
			for (let i = 1; i < length; i++) {
				// append up to 9 fields
				if (i >= 9) break;

				const track = queue.get(i);
				embed.addField(
					`> ${Utils.TEXT.EMOJIS.NUMBERS[i]} :   ${track.title} :: ${track.artist}`,
					`Duration: ${Utils.formatTime(track.duration)} - Requested by <@!${"requester"}>`
				);
			}
		}

		embed
			.setAuthor({ name: `🎵  Current track:` })
			.setTitle(
				`[${Utils.formatTime(currentTrack.duration)}] - ${currentTrack.title} :: ${
					currentTrack.artist
				}`
			)
			.setImage(currentTrack.imageUrl)
			.setFooter({
				text: `🗃️ There ${length === 1 ? "is 1 track" : `are ${length} tracks`} in the queue.`,
			})
			.setColor("GREYPLE");

		return embed;
	},
};
