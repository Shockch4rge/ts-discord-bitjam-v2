import { MessageEmbed } from 'discord.js';

import { MessageCommandBuilder } from '../app/MessageCommandBuilder';

export const getProperUsageEmbed = (builder: MessageCommandBuilder) => {
	return new MessageEmbed()
		.setAuthor({ name: "❌  Invalid arguments provided!" })
		.setTitle("Proper usage:")
		.setFields([
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
			...builder.options.map(option => ({
				name: "`" + option.name + "`",
				value: option.description,
			})),
		])
		.setFooter({
			text: "If you need help or a command isn't working, ping me.",
		})
		.setColor("RED");
};
