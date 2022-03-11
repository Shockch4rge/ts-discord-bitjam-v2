import { Client, Guild } from 'discord.js';
import { firestore } from 'firebase-admin';

import MusicService from './MusicService';

import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;

export default class GuildCache {
	public readonly bot: Client;
    public readonly guild: Guild;
	public readonly messagePrefix: string;
	public readonly userRefs: CollectionReference<DocumentData>;
	public readonly service: MusicService;

	public constructor(bot: Client, guild: Guild, userRefs: CollectionReference<DocumentData>, messagePrefix: string) {
		this.bot = bot;
		this.guild = guild;
        this.userRefs = userRefs;
		this.messagePrefix = messagePrefix;
		this.service = new MusicService();

        this.resetBot();
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
}
