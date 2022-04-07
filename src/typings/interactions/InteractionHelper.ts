import { APIMessage } from "discord-api-types/v9";
import {
    AllowedThreadTypeForTextChannel, CommandInteraction, ContextMenuInteraction, Message,
    MessageComponentInteraction, MessageEmbed, ThreadChannel, ThreadCreateOptions,
    WebhookEditMessageOptions
} from "discord.js";

import GuildCache from "../../app/GuildCache";


export type InteractionResponseOptions = MessageEmbed | WebhookEditMessageOptions | string;

export type BaseInteractionHelperProps<
	I extends Message | CommandInteraction | MessageComponentInteraction | ContextMenuInteraction
> = {
	readonly interaction: I;
	readonly cache: GuildCache;
	respond: (options: InteractionResponseOptions) => Promise<APIMessage | Message>;
	createThread?: (options: ThreadCreateOptions<AllowedThreadTypeForTextChannel>) => Promise<ThreadChannel>;
};

export interface MessageComponentInteractionHelperProps<I extends MessageComponentInteraction>
	extends Omit<BaseInteractionHelperProps<I>, "respond"> {
	update: (options: InteractionResponseOptions) => Promise<void>;
}

export interface MessageInteractionHelperProps extends BaseInteractionHelperProps<Message> {
	clientReply?: Message;
	editReply: (options: InteractionResponseOptions) => Promise<APIMessage | Message | undefined>;
}

export interface SlashInteractionHelperProps extends BaseInteractionHelperProps<CommandInteraction> {
	editReply: (options: InteractionResponseOptions) => Promise<APIMessage | Message>;
}

export interface ContextMenuHelperProps extends BaseInteractionHelperProps<ContextMenuInteraction> {}
