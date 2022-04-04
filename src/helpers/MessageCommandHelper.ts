import { Message, MessageEmbed, WebhookMessageOptions } from "discord.js";

import GuildCache from "../app/GuildCache";


export class MessageCommandHelper {
	public readonly message: Message;
	public readonly options: unknown[];
	public readonly cache: GuildCache;

	public constructor(message: Message, options: unknown[], guildCache: GuildCache) {
		this.message = message;
		this.options = options;
		this.cache = guildCache;
	}

	public async respond(options: MessageEmbed | WebhookMessageOptions | string) {
		if (options instanceof MessageEmbed) {
			await this.message.channel
				.send({
					embeds: [options],
				})
				.catch(() => {});
		} else if (typeof options === "object") {
			await this.message.channel.send(options);
		} else {
			await this.message.channel
				.send({
					content: options,
				})
				.catch(() => {});
		}
	}
}
