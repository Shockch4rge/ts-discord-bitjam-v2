import {
    CommandInteraction, Message, MessageComponentInteraction, MessageEmbed,
    WebhookEditMessageOptions
} from "discord.js";

import GuildCache from "../../app/GuildCache";


export type InteractionResponseOptions = MessageEmbed | WebhookEditMessageOptions | string;

export type BaseInteractionHelperProps<I extends Message | CommandInteraction | MessageComponentInteraction> =
	{
		readonly interaction: I;
		readonly cache: GuildCache;
		respond: (options: InteractionResponseOptions) => Promise<void>;
	};

export interface MessageComponentInteractionHelperProps<I extends MessageComponentInteraction>
	extends Omit<BaseInteractionHelperProps<I>, "respond"> {
	update: (options: InteractionResponseOptions) => Promise<void>;
}

export interface MessageInteractionHelperProps extends BaseInteractionHelperProps<Message> {
	clientReply?: Message;
	editReply: (options: InteractionResponseOptions) => Promise<void>;
}

export interface SlashInteractionHelperProps extends BaseInteractionHelperProps<CommandInteraction> {
	editReply: (options: InteractionResponseOptions) => Promise<void>;
}
