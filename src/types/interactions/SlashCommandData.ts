import { SlashCommandBuilder } from '@discordjs/builders';

import { SlashCommandHelper } from '../../helpers/SlashCommandHelper';

export type SlashCommandData = {
	ephemeral?: boolean;

	builder: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

	guard?: {
		test: (helper: SlashCommandHelper) => Promise<void>;
		reject: (err: Error, helper: SlashCommandHelper) => Promise<void>;
	};

	execute: (helper: SlashCommandHelper) => Promise<void>;
};
