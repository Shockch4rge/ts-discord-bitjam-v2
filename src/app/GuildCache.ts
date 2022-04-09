import AfterEvery from "after-every";
import { Collection, Guild, GuildChannel } from "discord.js";

import { formatEmoji } from "@discordjs/builders";

import config from "../../config.json";
import Bitjam from "../Bitjam";
import { logger } from "../utils/logger";
import { FireStore } from "./FireStore";
import MusicService from "./MusicService";


export default class GuildCache {
	public readonly client: Bitjam;
	public readonly db: FireStore;
	public readonly guild: Guild;
	public readonly music: MusicService;
	public readonly emojis: Collection<string, string>;
	public readonly prefix: string;

	public constructor(client: Bitjam, db: FireStore, guild: Guild, messagePrefix: string) {
		this.client = client;
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
			this.guild.me!.voice.disconnect();
		}
	}

	public nick(name: string) {
		this.guild.me!.setNickname(name);
	}

	public unnick() {
		this.guild.me!.setNickname("⏱ BitJam | Idle");
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
