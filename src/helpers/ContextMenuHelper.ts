import {
    AllowedThreadTypeForTextChannel, CacheType, CommandInteraction, ContextMenuInteraction, Message,
    MessageEmbed, TextChannel, ThreadChannel, ThreadCreateOptions
} from "discord.js";

import GuildCache from "../app/GuildCache";
import { ContextMenuHelperProps, InteractionResponseOptions } from "../typings/interactions";


export class ContextMenuInteractionHelper implements ContextMenuHelperProps {
	public readonly interaction: ContextMenuInteraction;
	public readonly cache: GuildCache;

	public constructor(interaction: ContextMenuInteraction, guildCache: GuildCache) {
		this.interaction = interaction;
		this.cache = guildCache;
	}

	public async respond(options: InteractionResponseOptions) {
		if (options instanceof MessageEmbed) {
			return this.interaction.followUp({ embeds: [options] });
		} else if (typeof options === "object") {
			return this.interaction.followUp(options);
		}

		return this.interaction.followUp({ content: options });
	}

	public async createThread(options: ThreadCreateOptions<AllowedThreadTypeForTextChannel>) {
		const channel = this.interaction.channel as TextChannel;
		return channel.threads.create(options);
	}
}
