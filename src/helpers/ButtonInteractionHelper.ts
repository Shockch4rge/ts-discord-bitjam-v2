import { ButtonInteraction, MessageEmbed, WebhookEditMessageOptions } from "discord.js";

import GuildCache from "../app/GuildCache";
import {
    InteractionResponseOptions, MessageComponentInteractionHelperProps
} from "../types/InteractionHelper";


export class ButtonHelper implements MessageComponentInteractionHelperProps<ButtonInteraction> {
	public interaction: ButtonInteraction;
	public cache: GuildCache;

	public constructor(interaction: ButtonInteraction, guildCache: GuildCache) {
		this.interaction = interaction;
		this.cache = guildCache;
	}

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
