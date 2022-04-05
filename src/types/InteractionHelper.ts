import {
    ButtonInteraction, CommandInteraction, Interaction, Message, MessageComponentInteraction,
    MessageEmbed, SelectMenuInteraction, WebhookEditMessageOptions, WebhookMessageOptions
} from "discord.js";

import GuildCache from "../app/GuildCache";


export type InteractionResponseOptions = MessageEmbed | WebhookEditMessageOptions | string;

export type BaseInteractionHelperProps<I extends Message | CommandInteraction | MessageComponentInteraction> = {
	readonly interaction: I;
	readonly cache: GuildCache;
	respond: (options: InteractionResponseOptions) => Promise<void>;
}

export interface MessageComponentInteractionHelperProps<I extends MessageComponentInteraction>
	extends Omit<BaseInteractionHelperProps<I>, "respond"> {
	update: (options: InteractionResponseOptions) => Promise<void>;
}

export interface MessageInteractionHelperProps extends BaseInteractionHelperProps<Message> {
	clientReply?: Message;
	edit: (options: InteractionResponseOptions) => Promise<void>;
}

export interface SlashInteractionHelperProps extends BaseInteractionHelperProps<CommandInteraction> {
	edit: (options: InteractionResponseOptions) => Promise<void>;
}
