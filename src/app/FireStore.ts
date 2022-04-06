import { initializeApp } from "firebase/app";
import {
    collection, CollectionReference, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs,
    getFirestore, query, setDoc, where
} from "firebase/firestore";

import config from "../../config.json";
import { Playlist } from "../typings/playlist";


export class FireStore {
	private readonly fs: Firestore;
	private readonly guildRefs: CollectionReference<DocumentData>;
	private readonly userRefs: CollectionReference<DocumentData>;
	private readonly playlistRefs: CollectionReference<DocumentData>;

	public constructor() {
		this.fs = getFirestore(initializeApp(config.firebase.config));
		this.guildRefs = collection(this.fs, config.firebase.collection.guilds);
		this.userRefs = collection(this.fs, config.firebase.collection.users);
		this.playlistRefs = collection(this.fs, config.firebase.collection.playlists);
	}

	public async registerGuild(id: string) {
		const guildRef = doc(this.guildRefs, id);
		const snap = await getDoc(guildRef);

		if (!snap.exists()) {
			await setDoc(guildRef, {
				prefix: ">>",
			});
		}
    }
    
    public async eraseGuild(id: string) {
        const guildRef = doc(this.guildRefs, id);
		const snap = await getDoc(guildRef);

		if (snap.exists()) {
			await deleteDoc(guildRef);
		}
    }

	public async getPrefix(guildId: string) {
		const snap = await getDoc(doc(this.guildRefs, guildId));

		if (snap.exists()) {
			return snap.get("prefix") as string;
		}

		return ">>";
	}

	public async setPrefix(prefix: string, guildId: string) {
		await setDoc(doc(this.guildRefs, guildId), { prefix }, { merge: true });
	}

	public async setChannel(channelId: string, guildId: string) {
		await setDoc(doc(this.guildRefs, guildId), { channelId }, { merge: true });
	}

	public async getUserPlaylists(userId: string) {
		const snap = await getDocs(query(this.playlistRefs, where("userId", "==", userId)));

		return snap.docs.map(
			doc =>
				new Playlist({
					name: doc.get("name") as string,
					trackUrls: doc.get("tracks") as string[],
					createdAt: new Date(doc.get("createdAt") as Date),
				})
		);
	}

	public async createPlaylist(userId: string, playlistName: string) {
		await setDoc(doc(this.playlistRefs, userId), {
			name: playlistName,
			tracks: [],
		});
	}

	public async addToPlaylist(track: any) {}
}
