import { Message, MessageEmbed, WebhookEditMessageOptions } from "discord.js";

import GuildCache from "../app/GuildCache";
import {
    InteractionResponseOptions, MessageInteractionHelperProps
} from "../types/interactions/InteractionHelper";


export class MessageInteractionHelper implements MessageInteractionHelperProps {
	public readonly interaction: Message;
	public readonly cache: GuildCache;
	public readonly options: unknown[];
	public clientReply?: Message;
	
	public constructor(interaction: Message, guildCache: GuildCache, options: unknown[]) {
		this.interaction = interaction;
		this.cache = guildCache;
		this.options = options;
	}

	public async respond(options: InteractionResponseOptions) {
		if (options instanceof MessageEmbed) {
			this.interaction
				.reply({ embeds: [options] })
				.then(reply => (this.clientReply = reply))
				.catch(() => {});
		} else if (typeof options === "object") {
			this.interaction
				.reply(options)
				.then(reply => (this.clientReply = reply))
				.catch(() => {});
		} else {
			this.interaction
				.reply(options)
				.then(reply => (this.clientReply = reply))
				.catch(() => {});
		}
	}

	public async edit(options: MessageEmbed | WebhookEditMessageOptions | string) {
		if (options instanceof MessageEmbed) {
			await this.clientReply?.edit({ embeds: [options] }).catch(() => {});
		} else if (typeof options === "object") {
			await this.clientReply?.edit(options).catch(() => {});
		} else {
			await this.clientReply?.edit({ content: options }).catch(() => {});
		}
	}
}
