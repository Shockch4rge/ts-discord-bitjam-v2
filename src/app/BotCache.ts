import "dotenv/config";

import { Client, Collection, Guild } from "discord.js";
import { initializeApp } from "firebase/app";
import {
    addDoc, collection, CollectionReference, deleteDoc, doc, DocumentData, Firestore, getDoc,
    getFirestore, setDoc
} from "firebase/firestore";

import config from "../../config.json";
import GuildCache from "./GuildCache";


export default class BotCache {
	public readonly db: Firestore;
	public readonly bot: Client;
	public readonly guildCaches: Collection<string, GuildCache>;
	public readonly guildRefs: CollectionReference<DocumentData>;
	public readonly userRefs: CollectionReference<DocumentData>;
	public readonly playlistRefs: CollectionReference<DocumentData>;

	public constructor(bot: Client) {
		this.db = getFirestore(initializeApp(config.firebase.config));
		this.bot = bot;
		this.guildCaches = new Collection();
		this.guildRefs = collection(this.db, config.firebase.collection.guilds);
		this.userRefs = collection(this.db, config.firebase.collection.users);
		this.playlistRefs = collection(this.db, config.firebase.collection.playlists);
	}

	public async getGuildCache(guild: Guild) {
		let cache = this.guildCaches.get(guild.id);

		if (!cache) {
			cache = await this.createGuildCache(guild);
		}

		return cache;
	}

	public async createGuildCache(guild: Guild) {
		const guildRef = doc(this.guildRefs, guild.id);
		let snap = await getDoc(guildRef);

		if (!snap.exists) {
			await setDoc(guildRef, {
				prefix: ">>",
			});
			snap = await getDoc(guildRef);
		}

		const cache = new GuildCache(
			this.bot,
			guild,
			guildRef,
			this.userRefs,
			this.playlistRefs,
			snap.get("prefix")
		);
		this.guildCaches.set(guild.id, cache);
		return cache;
	}

	public async deleteGuildCache(guildId: string) {
		const guildRef = doc(this.guildRefs, guildId);
		const snap = await getDoc(guildRef);

		// const doc = await this.guildRefs.doc(guildId).get();
		if (snap.exists()) {
			await deleteDoc(guildRef);
		}
		this.guildCaches.delete(guildId);
	}
}
