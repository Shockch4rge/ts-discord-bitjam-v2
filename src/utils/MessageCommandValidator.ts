import { MessageCommandBuilder, MessageCommandOption } from '../app/MessageCommandBuilder';

export class MessageCommandValidator {
	public static validateOptions(actual: MessageCommandOption[], received: string[]) {
		if (actual.length !== received.length) return false;

		for (const receivedOption of received) {
			for (const actualOption of actual) {
				typeof actualOption.type;
			}

			let optionType: unknown;

			if (receivedOption === "true") {
				optionType = true;
			}

			if (receivedOption === "false") {
				optionType = false;
			}

			if (Number.parseInt(receivedOption) !== NaN) {
				optionType = Number.parseInt(receivedOption);
			}

			if (Number.parseFloat(receivedOption) !== NaN) {
				optionType = Number.parseFloat(receivedOption);
			}
		}

		return true;
	}

	public static validatePrefix(actual: string, received: string) {
		return received.startsWith(actual);
	}
}
