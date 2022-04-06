import { CacheType, CommandInteraction, ContextMenuInteraction } from "discord.js";

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

    };
}