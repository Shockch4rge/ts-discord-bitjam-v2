import { SlashCommandBuilder } from '@discordjs/builders';

import { SlashCommandHelper } from '../helpers/SlashCommandHelper';

export type SlashCommandData = {
	ephemeral?: boolean;

	guard?: {
		test: (helper: SlashCommandHelper) => Promise<void>;
		fail: (err: Error, helper: SlashCommandHelper) => Promise<void>;
	};

	builder: SlashCommandBuilder;

	execute: (helper: SlashCommandHelper) => Promise<void>;
};
