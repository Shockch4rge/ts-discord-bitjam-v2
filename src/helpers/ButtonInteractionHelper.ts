import { ButtonInteraction, MessageEmbed, WebhookEditMessageOptions } from "discord.js";

import GuildCache from "../app/GuildCache";
import { MessageComponentInteractionHelperProps } from "../typings/interactions/InteractionHelper";


export class ButtonHelper implements MessageComponentInteractionHelperProps<ButtonInteraction> {
	public readonly interaction: ButtonInteraction;
	public readonly cache: GuildCache;

	public constructor(interaction: ButtonInteraction, guildCache: GuildCache) {
		this.interaction = interaction;
		this.cache = guildCache;
	}

	public async update(options: MessageEmbed | WebhookEditMessageOptions | string) {
		if (options instanceof MessageEmbed) {
			await this.interaction.update({ embeds: [options] });
		} else if (typeof options === "object") {
			await this.interaction.update(options);
		} else {
			await this.interaction.update({ content: options });
		}
	}
}
