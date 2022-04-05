import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";

import GuildCache from "../app/GuildCache";
import {
    InteractionResponseOptions, SlashInteractionHelperProps
} from "../types/InteractionHelper";


export class SlashCommandHelper implements SlashInteractionHelperProps {
	public interaction: CommandInteraction;
	public cache: GuildCache;

	public constructor(interaction: CommandInteraction, guildCache: GuildCache) {
		this.interaction = interaction;
		this.cache = guildCache;
	}

	public async respond(options: InteractionResponseOptions) {
		if (options instanceof MessageEmbed) {
			await this.interaction.followUp({ embeds: [options] }).catch(() => {});
		} else if (typeof options === "object") {
			this.interaction.followUp(options).catch(() => {});
		} else {
			this.interaction.followUp(options).catch(() => {});
		}
	}

	public async edit(options: InteractionResponseOptions) {}

	public mentionable(name: string) {
		return this.interaction.options.getMentionable(name);
	}

	public channel(name: string) {
		return this.interaction.options.getChannel(name);
	}

	public role(name: string) {
		return this.interaction.options.getRole(name);
	}

	public user(name: string) {
		return this.interaction.options.getUser(name);
	}

	public string(name: string) {
		return this.interaction.options.getString(name);
	}

	public integer(name: string) {
		return this.interaction.options.getInteger(name);
	}

	public boolean(name: string) {
		return this.interaction.options.getBoolean(name);
	}

	public subcommand() {
		return this.interaction.options.getSubcommand();
	}
}
