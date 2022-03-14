import { PermissionResolvable, RoleResolvable } from 'discord.js';

export interface MessageCommandBuilderData {
	name: string;
	description: string;
	aliases?: string[];
	options?: MessageCommandOption[];
	roleIds?: string[];
	permissions?: PermissionResolvable[];
	regex?: RegExp;
}
export class MessageCommandBuilder {
	public name: string;
	public description: string;
	public aliases: string[];
	public options: MessageCommandOption[];
	public roleIds: string[];
	public permissions: PermissionResolvable[];
	public regex: RegExp;

	public constructor(data?: MessageCommandBuilderData) {
		this.name = data?.name ?? "No name implemented";
		this.description = data?.description ?? "No description implemented";
		this.aliases = data?.aliases ?? [];
		this.options = data?.options ?? [];
		this.roleIds = data?.roleIds ?? [];
		this.permissions = data?.permissions ?? [];
		this.regex = data?.regex ?? new RegExp(".")
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

	public setRoles(roleIds: string[]) {
		this.roleIds = roleIds;
		return this;
	}

	public setPermissions(permissions: PermissionResolvable[]) {
		this.permissions = permissions;
		return this;
	}

	public addStringOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(OptionType.STRING));
		this.options.push(option);
		return this;
	}

	public addNumberOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(OptionType.NUMBER));
		this.options.push(option);
		return this;
	}

	public addBooleanOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(OptionType.BOOLEAN));
		this.options.push(option);
		return this;
	}

	public addMentionableOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(OptionType.MENTIONABLE));
		this.options.push(option);
		return this;
	}

	public toRegex(messagePrefix: string) {
		const options = this.options.map(option => option.name);
		return new RegExp(
			`^${messagePrefix}(${this.name}|${this.aliases.join("|")})\s${options.map(o => `(.+)`).join("")}`,
			"gm"
		);
	}
}

export class MessageCommandOption {
	public name: string;
	public description: string;
	public choices?: unknown[];
	public type: OptionType;

	public constructor(type: OptionType) {
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

	public addChoice<ValueType = string>(choice: [name: string, value: ValueType]) {
		if (!this.choices) {
			this.choices = [];
		}

		this.choices.push(choice);
		return this;
	}

	public setChoices<ValueType>(choices: [name: string, value: ValueType][]) {
		this.choices = choices;
		return this;
	}
}

export enum OptionType {
	BOOLEAN = "true/false",
	NUMBER = "number",
	STRING = "text",
	MENTIONABLE = "mention",
}
