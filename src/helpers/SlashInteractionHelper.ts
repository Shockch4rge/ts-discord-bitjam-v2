import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";

import GuildCache from "../app/GuildCache";
import {
    InteractionResponseOptions, SlashInteractionHelperProps
} from "../typings/interactions/InteractionHelper";


export class SlashInteractionHelper implements SlashInteractionHelperProps {
	public readonly interaction: CommandInteraction;
	public readonly cache: GuildCache;

	public constructor(interaction: CommandInteraction, guildCache: GuildCache) {
		this.interaction = interaction;
		this.cache = guildCache;
	}

	public async respond(options: InteractionResponseOptions) {
		if (options instanceof MessageEmbed) {
			return this.interaction.followUp({ embeds: [options] });
		} else if (typeof options === "object") {
			return this.interaction.followUp(options);
		} else {
			return this.interaction.followUp(options);
		}
	}

	public async editReply(options: InteractionResponseOptions) {
		if (options instanceof MessageEmbed) {
			return this.interaction.editReply({ embeds: [options] });
		} else if (typeof options === "object") {
			return this.interaction.editReply(options);
		} else {
			return this.interaction.editReply({ content: options });
		}
	}

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
