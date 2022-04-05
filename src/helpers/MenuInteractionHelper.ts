import {
    CacheType, MessageEmbed, SelectMenuInteraction, WebhookEditMessageOptions
} from "discord.js";

import GuildCache from "../app/GuildCache";
import {
    InteractionResponseOptions, MessageComponentInteractionHelperProps
} from "../types/InteractionHelper";


export class MenuHelper implements MessageComponentInteractionHelperProps<SelectMenuInteraction> {
	public interaction: SelectMenuInteraction<CacheType>;
	public cache: GuildCache;

	public constructor(interaction: SelectMenuInteraction, guildCache: GuildCache) {
		this.interaction = interaction;
		this.cache = guildCache;
	}

	public async respond(options: InteractionResponseOptions): Promise<void> {}

	public async update(options: MessageEmbed | WebhookEditMessageOptions | string) {
		if (options instanceof MessageEmbed) {
			await this.interaction
				.update({
					embeds: [options],
				})
				.catch(() => {});
		} else if (typeof options === "object") {
			await this.interaction.editReply(options);
		} else {
			await this.interaction
				.update({
					content: options,
				})
				.catch(() => {});
		}
	}
}
