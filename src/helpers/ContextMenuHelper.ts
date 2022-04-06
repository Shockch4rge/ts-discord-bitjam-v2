import { CacheType, CommandInteraction, ContextMenuInteraction, MessageEmbed } from "discord.js";

import GuildCache from "../app/GuildCache";
import { ContextMenuHelperProps, InteractionResponseOptions } from "../typings/interactions";


export class ContextMenuInteractionHelper implements ContextMenuHelperProps {
    public readonly interaction: ContextMenuInteraction;
    public readonly cache: GuildCache;

    public constructor(interaction: ContextMenuInteraction, guildCache: GuildCache) {
        this.interaction = interaction;
        this.cache = guildCache;
    }

    public async respond(options: InteractionResponseOptions) {
        if (options instanceof MessageEmbed) {
			await this.interaction.followUp({ embeds: [options] }).catch(() => {});
		} else if (typeof options === "object") {
			await this.interaction.followUp(options);
		} else {
			await this.interaction.followUp({ content: options }).catch(() => {});
		}
    };
}