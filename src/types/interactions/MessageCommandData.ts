import { MessageCommandHelper } from "../../helpers/MessageCommandHelper";


import type { MessageCommandBuilder } from 'djs-message-commands';

export type MessageCommandData = {
	builder: MessageCommandBuilder;

	guard?: {
		test: (helper: MessageCommandHelper) => Promise<void>;
		reject: (err: Error, helper: MessageCommandHelper) => Promise<void>;
	};

	execute: (helper: MessageCommandHelper) => Promise<void>;
};