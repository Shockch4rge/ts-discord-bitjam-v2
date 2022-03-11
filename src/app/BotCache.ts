import 'dotenv/config';

import { Client, Collection, Guild } from 'discord.js';
import admin, { firestore, ServiceAccount } from 'firebase-admin';

import config from '../../config.json';
import GuildCache from './GuildCache';

import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;

export default class BotCache {
	public readonly db: FirebaseFirestore.Firestore;
	public readonly bot: Client;
	public readonly guildCaches: Collection<string, GuildCache>;
	public readonly guildRefs: CollectionReference<DocumentData>;
	public readonly userRefs: CollectionReference<DocumentData>;

	public constructor(bot: Client) {
		admin.initializeApp({
			credential: admin.credential.cert(config.firebase.service_account as ServiceAccount),
		});
		this.db = admin.firestore();

		this.bot = bot;
		this.guildCaches = new Collection<string, GuildCache>();
		this.guildRefs = this.db.collection(config.firebase.collection.guilds);
		this.userRefs = this.db.collection(config.firebase.collection.users);
	}

	public async getGuildCache(guild: Guild) {
		let cache = this.guildCaches.get(guild.id);

		if (!cache) {
			cache = await this.createGuildCache(guild);
		}

		return cache;
	}

	public async createGuildCache(guild: Guild) {
		const guildRef = this.guildRefs.doc(guild.id);
		let snap = await guildRef.get();

		if (!snap.exists) {
			await guildRef.create({
				prefix: ">>",
			});
			snap = await guildRef.get();
		}

		const cache = new GuildCache(this.bot, guild, this.userRefs, snap.get("prefix"));
		this.guildCaches.set(guild.id, cache);
		return cache;
	}

	public async deleteGuildCache(guildId: string) {
		const doc = await this.guildRefs.doc(guildId).get();
		if (doc.exists) {
			await this.guildRefs.doc(guildId).delete();
		}
		this.guildCaches.delete(guildId);
	}
}
