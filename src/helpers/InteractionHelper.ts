import {
    BaseCommandInteraction, ButtonInteraction, CommandInteraction, Interaction, MessageEmbed,
    SelectMenuInteraction, WebhookEditMessageOptions, WebhookMessageOptions
} from 'discord.js';

import GuildCache from '../app/GuildCache';

export abstract class InteractionHelper<
	I extends ButtonInteraction | CommandInteraction | SelectMenuInteraction
> {
	public readonly interaction: I;
	public readonly cache: GuildCache;

	public constructor(interaction: I, guildCache: GuildCache) {
		this.interaction = interaction;
		this.cache = guildCache;
	}

	public async respond(options: MessageEmbed | WebhookMessageOptions | string) {
		if (options instanceof MessageEmbed) {
			await this.interaction
				.followUp({
					embeds: [options],
				})
				.catch(() => {});
		} else if (typeof options === "object") {
			await this.interaction.followUp(options);
		} else {
			await this.interaction
				.followUp({
					content: options,
				})
				.catch(() => {});
		}
	}

	public async edit(options: MessageEmbed | WebhookEditMessageOptions | string) {
		if (options instanceof MessageEmbed) {
			await this.interaction
				.editReply({
					embeds: [options],
				})
				.catch(() => {});
		} else if (typeof options === "object") {
			await this.interaction.editReply(options);
		} else {
			await this.interaction
				.editReply({
					content: options,
				})
				.catch(() => {});
		}
	}
}
