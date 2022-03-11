import { MessageCommandBuilder } from '../../app/MessageCommandBuilder';
import { MessageCommandData } from '../../types';

module.exports = {
	builder: new MessageCommandBuilder()
		.setName("help")
		.setDescription("Displays this help message.")
		.addOption<string>(option =>
			option
				.setName("command")
				.setDescription("The command to get help for.")
				.addChoices<string>([
					["all", "all"],
					["help", "help"],
					["ping", "ping"],
				])
		),

	execute: async helper => {
		const [, target] = helper.options;
	},
} as MessageCommandData;
