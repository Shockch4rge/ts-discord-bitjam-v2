import { MessageEmbed, Options } from 'discord.js';

import { MessageCommandBuilder } from './MessageCommandBuilder';

export const getProperUsageEmbed = (builder: MessageCommandBuilder) => {
	const embed = new MessageEmbed()
		.setAuthor({ name: "❌  Invalid arguments provided!" })
		.setTitle("Proper usage:")
		.addFields([
			{
				name: "Name",
				value: builder.name,
				inline: true,
			},
			{
				name: "Aliases",
				value: builder.aliases.length <= 0 ? "None" : builder.aliases.join(", "),
				inline: true,
			},
			{
				name: "Arguments",
				value:
					builder.options.length <= 0
						? "None"
						: `${builder.name} ${builder.options
								.map(option => "`<" + option.name + ">`")
								.join(" ")}`,
				inline: true,
			},
		]);
	

	for (const option of builder.options) {
		embed.addFields([
			{
				name: "Argument",
				value: option.name,
				inline: true,
			},
			{
				name: "Type",
				value: option.type,
				inline: true,
			},
			{
				name: "Description",
				value: option.description,
				inline: true,
			},
		]);
	}

	embed.setFooter({ text: "If you need help or a command isn't working, ping me." });
	embed.setColor("RED");

	return embed;
};
