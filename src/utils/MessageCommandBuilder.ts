import { DiscordTypes, MessageCommandData } from '../types/data';

export class MessageCommandBuilder {
	public name: string;
	public description: string;
	public aliases: string[];
	public options: MessageCommandOption[];

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

	public addStringOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption("string"));
		this.options.push(option);
		return this;
	}

	public addNumberOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption("number"));
		this.options.push(option);
		return this;
	}

	public addBooleanOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption("boolean"));
		this.options.push(option);
		return this;
	}
}

export class MessageCommandOption {
	public name: string;
	public description: string;
	public choices?: unknown[];
	public type: "string" | "number" | "boolean" | `<!@${string}>`;

	public constructor(type: "string" | "number" | "boolean" | `<!@${string}>`) {
		this.name = "No name implemented";
		this.description = "No description implemented";
		this.type = type;
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
