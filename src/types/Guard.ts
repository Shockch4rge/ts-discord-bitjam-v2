import { Interaction, Message } from "discord.js";

import GuildCache from "../app/GuildCache";


export abstract class Guard {
	public readonly name: string;
	public readonly message: string;

	protected constructor(data: GuardData) {
		this.name = data.name;
		this.message = data.message;
	}

	public abstract execute(cache: GuildCache, interaction: Message | Interaction): Promise<boolean>;
}

export interface GuardData {
	name: string;
	message: string;
}

export type GuardCreator = Constructor<Guard>;
