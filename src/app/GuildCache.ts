import AfterEvery from 'after-every';
import { Client, Guild, GuildChannel } from 'discord.js';
import { firestore } from 'firebase-admin';

import { logger } from '../utils/logger';
import MusicService from './MusicService';

import CollectionReference = firestore.CollectionReference;
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;

export default class GuildCache {
	public readonly bot: Client;
	public readonly guild: Guild;
	public readonly guildRef: DocumentReference<DocumentData>;
	public readonly userRefs: CollectionReference<DocumentData>;
	public readonly messagePrefix: string;
	public readonly service: MusicService;

	public constructor(
		bot: Client,
		guild: Guild,
		guildRef: DocumentReference<DocumentData>,
		userRefs: CollectionReference<DocumentData>,
		messagePrefix: string
	) {
		this.bot = bot;
		this.guild = guild;
		this.guildRef = guildRef;
		this.userRefs = userRefs;
		this.messagePrefix = messagePrefix;
		this.service = new MusicService();

		this.resetBot();
	}

	public async setMessagePrefix(prefix: string) {
		const snap = await this.guildRef.get();

		if (snap.exists) {
			await this.guildRef.update({ prefix });
		}
	}

	// leave empty voice channels, un-nick
	private resetBot() {
		this.unNick();
		if (this.guild.me!.voice.channel && this.guild.me!.voice.channel.members.size === 1) {
			void this.guild.me!.voice.disconnect();
		}
	}

	public nick(name: string) {
		void this.guild.me!.setNickname(name);
	}

	public unNick() {
		void this.guild.me!.setNickname(null);
	}

	public async affirmConnectionMinutely(channelId: string) {
		const interval = 2;
		let sessionMinutes = 0;

		const timer = AfterEvery(interval).minutes(async () => {
			const channel = this.guild.channels.cache.get(channelId) as GuildChannel | undefined;
			if (!channel) return;

			if (channel.isVoice()) {
				sessionMinutes += interval;

				if (channel.members.size === 1 && channel.members.get(this.guild.me!.id)) {
					await this.guild.me!.voice.disconnect();
					this.service.destroyConnection();
					this.unNick();
					logger.info(`[DISCONNECT] Session time: ${sessionMinutes} minutes`);
					sessionMinutes = 0;
					timer();
				}
			}
		});
	}
}
