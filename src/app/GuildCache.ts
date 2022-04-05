import AfterEvery from "after-every";
import { Client, Collection, Guild, GuildChannel } from "discord.js";

import { formatEmoji } from "@discordjs/builders";

import config from "../../config.json";
import { logger } from "../utils/logger";
import { FireStore } from "./FireStore";
import MusicService from "./MusicService";


export default class GuildCache {
	public readonly bot: Client;
	public readonly db: FireStore;
	public readonly guild: Guild;
	public readonly music: MusicService;
	public readonly emojis: Collection<string, string>;
	public readonly prefix: string;

	public constructor(bot: Client, db: FireStore, guild: Guild, messagePrefix: string) {
		this.bot = bot;
		this.db = db;
		this.guild = guild;
		this.music = new MusicService();
		this.emojis = new Collection();
		this.prefix = messagePrefix;

		for (const key in config.emojis) {
			this.emojis.set(key, formatEmoji(config.emojis[key as keyof typeof config.emojis]));
		}

		this.resetBot();
	}

	// leave empty voice channels, un-nick
	private resetBot() {
		this.unnick();
		if (this.guild.me!.voice.channel && this.guild.me!.voice.channel.members.size === 1) {
			void this.guild.me!.voice.disconnect();
		}
	}

	public nick(name: string) {
		void this.guild.me!.setNickname(name);
	}

	public unnick() {
		void this.guild.me!.setNickname(null);
	}

	public async affirmConnectionMinutely(channelId: string) {
		const interval = 2;
		let sessionMinutes = 0;

		const timer = AfterEvery(interval).minutes(async () => {
			const channel = this.guild.channels.cache.get(channelId) as GuildChannel | undefined;
			if (!channel) {
				return timer();
			}

			if (channel.isVoice()) {
				sessionMinutes += interval;

				if (channel.members.size === 1 && channel.members.get(this.guild.me!.id)) {
					await this.guild.me!.voice.disconnect();
					this.music.destroyConnection();
					this.unnick();
					logger.info(`[DISCONNECT] Session time: ${sessionMinutes} minutes`);
					sessionMinutes = 0;
					timer();
				}
			}
		});
	}
}
