import { MessageCommandData } from '../../types/data';
import { MessageCommandBuilder } from '../../utils/MessageCommandBuilder';

const command: MessageCommandData = {
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
};

module.exports = command;
