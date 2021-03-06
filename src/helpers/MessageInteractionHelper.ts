import { Message, MessageEmbed, WebhookEditMessageOptions } from "discord.js";

import GuildCache from "../app/GuildCache";
import {
    InteractionResponseOptions, MessageInteractionHelperProps
} from "../typings/interactions/InteractionHelper";


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

		return this.clientReply!;
	}

	public async editReply(options: MessageEmbed | WebhookEditMessageOptions | string) {
		if (options instanceof MessageEmbed) {
			return this.clientReply?.edit({ embeds: [options] });
		} else if (typeof options === "object") {
			return this.clientReply?.edit(options);
		} else {
			return this.clientReply?.edit({ content: options });
		}
	}
}
