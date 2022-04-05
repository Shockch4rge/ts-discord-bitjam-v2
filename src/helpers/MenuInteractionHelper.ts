import { MessageEmbed, SelectMenuInteraction, WebhookEditMessageOptions } from "discord.js";

import GuildCache from "../app/GuildCache";
import { MessageComponentInteractionHelperProps } from "../types/interactions/InteractionHelper";


export class MenuInteractionHelper implements MessageComponentInteractionHelperProps<SelectMenuInteraction> {
	public readonly interaction: SelectMenuInteraction;
	public readonly cache: GuildCache;

	public constructor(interaction: SelectMenuInteraction, guildCache: GuildCache) {
		this.interaction = interaction;
		this.cache = guildCache;
	}

	public async update(options: MessageEmbed | WebhookEditMessageOptions | string) {
		if (options instanceof MessageEmbed) {
			await this.interaction.update({ embeds: [options] }).catch(() => {});
		} else if (typeof options === "object") {
			await this.interaction.update(options);
		} else {
			await this.interaction.update({ content: options }).catch(() => {});
		}
	}
}
