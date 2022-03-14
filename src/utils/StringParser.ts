import { MemberMention, MessageMentions } from 'discord.js';

export class StringParser {
	public toBoolean(string: string): boolean {
		return /^\s*(true|1|on)\s*$/i.test(string);
	}

	public toNumber(string: string): number | undefined {
		const number = Number.parseInt(string);

		if (Number.isNaN(number)) {
			return undefined;
		}

		return number;
	}

	public toFloat(string: string): number | undefined {
		const number = Number.parseFloat(string);

		if (Number.isNaN(number)) {
			return undefined;
		}

		return number;
	}

	public toMemberId(string: string): MemberMention | undefined {
		const matches = string.matchAll(MessageMentions.USERS_PATTERN).next().value;

		if (!matches) {
			return undefined;
		}

		// member id
		return matches[1];
	}
}
