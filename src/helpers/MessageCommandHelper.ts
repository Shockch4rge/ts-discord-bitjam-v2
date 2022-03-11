import { Message, MessageEmbed, WebhookMessageOptions } from 'discord.js';

import GuildCache from '../app/GuildCache';
import { DiscordTypes } from '../types/data';

export class MessageCommandHelper {
	public readonly message: Message;
	public readonly cache: GuildCache;
	public readonly options: DiscordTypes[];

	public constructor(message: Message, guildCache: GuildCache) {
		this.message = message;
		this.cache = guildCache;
		this.options = message.content.split(" ");
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
