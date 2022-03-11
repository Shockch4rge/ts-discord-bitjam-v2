import { MemberMention, RoleMention, UserMention } from 'discord.js';

export type { MessageCommandData } from "./MessageCommandData";
export type { SlashCommandData } from "./SlashCommandData";
export type { ButtonData } from "./ButtonData";
export type { MenuData } from "./MenuData";
export type DiscordTypes = string | number | MemberMention | RoleMention | UserMention;
