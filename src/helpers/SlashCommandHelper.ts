import { CommandInteraction } from 'discord.js';

import GuildCache from '../app/GuildCache';
import { InteractionHelper } from './InteractionHelper';

export class SlashCommandHelper extends InteractionHelper<CommandInteraction> {
	public constructor(interaction: CommandInteraction, guildCache: GuildCache) {
		super(interaction, guildCache);
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
