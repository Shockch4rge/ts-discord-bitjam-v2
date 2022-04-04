import AfterEvery from "after-every";
import { Client, Collection, Guild, GuildChannel } from "discord.js";
import {
    CollectionReference, doc, DocumentData, DocumentReference, getDoc, setDoc, updateDoc
} from "firebase/firestore";

import { formatEmoji } from "@discordjs/builders";

import config from "../../config.json";
import { logger } from "../utils/logger";
import MusicService from "./MusicService";


export default class GuildCache {
	public readonly bot: Client;
	public readonly guild: Guild;
	public readonly guildRef: DocumentReference<DocumentData>;
	public readonly userRefs: CollectionReference<DocumentData>;
	public readonly playlistRefs: CollectionReference<DocumentData>;
	public readonly messagePrefix: string;
	public readonly music: MusicService;
	public readonly emojis: Collection<string, string>;

	public constructor(
		bot: Client,
		guild: Guild,
		guildRef: DocumentReference<DocumentData>,
		userRefs: CollectionReference<DocumentData>,
		playlistRefs: CollectionReference<DocumentData>,
		messagePrefix: string
	) {
		this.bot = bot;
		this.guild = guild;
		this.guildRef = guildRef;
		this.userRefs = userRefs;
		this.playlistRefs = playlistRefs;
		this.messagePrefix = messagePrefix;
		this.music = new MusicService();
		this.emojis = new Collection();

		for (const key in config.emojis) {
			this.emojis.set(key, formatEmoji(config.emojis[key as keyof typeof config.emojis]));
		}

		this.resetBot();
	}

	public async setPrefix(prefix: string) {
		await setDoc(this.guildRef, { prefix }, { merge: true });
	}

	public async setChannel(channelId: string) {
		await setDoc(this.guildRef, { channelId }, { merge: true });
	}

	public async getUserPlaylists(userId: string) {
		const snap = await getDoc(doc(this.userRefs, userId));

		if (snap.exists()) {
		}
	}

	public async createPlaylist(userId: string, playlistName: string) {
		await setDoc(doc(this.playlistRefs, userId), {
			name: playlistName,
			tracks: [],
		});
	}

	public async addToPlaylist(track: any) {

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
