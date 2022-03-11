import { DiscordTypes, MessageCommandData } from '../types';

export class MessageCommandBuilder {
	public name: string;
	public description: string;
	public aliases: string[];
	public options: MessageCommandOption<unknown>[];

	public constructor() {
		this.name = "No name implemented";
		this.description = "No description implemented";
		this.aliases = [];
		this.options = [];
	}

	public setName(name: string) {
		this.name = name;
		return this;
	}

	public setDescription(description: string) {
		this.description = description;
		return this;
	}

	public setAliases(aliases: string[]) {
		this.aliases = aliases;
		return this;
	}

	public addOption<T extends DiscordTypes>(
		composer: (option: MessageCommandOption<T>) => MessageCommandOption<T>
	): this {
		const option = composer(new MessageCommandOption<T>());
		this.options.push(option);
		return this;
	}
}

export class MessageCommandOption<T extends DiscordTypes | unknown = unknown> {
	public name: string;
	public description: string;
	public choices?: unknown[];
	/**
	 * Use typeof with this property to evaluate it
	 */
	public readonly type!: T;

	public constructor() {
		this.name = "No name implemented";
		this.description = "No description implemented";
	}

	public setName(name: string) {
		this.name = name;
		return this;
	}

	public setDescription(description: string) {
		this.description = description;
		return this;
	}

	public addChoice<ValueType>(choice: [name: string, value: ValueType]) {
		if (!this.choices) {
			this.choices = [];
		}

		this.choices.push(choice);
		return this;
	}

	public addChoices<ValueType>(choices: [name: string, value: ValueType][]) {
		this.choices = choices;
		return this;
	}
}
