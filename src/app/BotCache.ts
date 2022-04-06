import { Client, Collection, Guild } from "discord.js";

import { FireStore } from "./FireStore";
import GuildCache from "./GuildCache";


export default class BotCache {
	public readonly bot: Client;
	public readonly db: FireStore;
	public readonly guildCaches: Collection<string, GuildCache>;

	public constructor(bot: Client) {
		this.bot = bot;
		this.db = new FireStore();
		this.guildCaches = new Collection();
	}

	public async getGuildCache(guild: Guild) {
		let cache = this.guildCaches.get(guild.id);

		if (!cache) {
			cache = await this.createGuildCache(guild);
		}

		return cache;
	}

	public async createGuildCache(guild: Guild) {
		const prefix = await this.db.getPrefix(guild.id);
		const cache = new GuildCache(this.bot, this.db, guild, prefix);
		this.guildCaches.set(guild.id, cache);
		return cache;
	}

	public async deleteGuildCache(guildId: string) {
		await this.db.eraseGuild(guildId);
		this.guildCaches.delete(guildId);
	}
}
