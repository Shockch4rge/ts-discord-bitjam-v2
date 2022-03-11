import { MessageCommandBuilder } from '../app/MessageCommandBuilder';
import { MessageCommandHelper } from '../helpers/MessageCommandHelper';

export type MessageCommandData = {
	builder: MessageCommandBuilder;

	guard?: {
		test: (helper: MessageCommandHelper) => Promise<void>;
		fail: (err: Error, helper: MessageCommandHelper) => Promise<void>;
	};

	execute: (helper: MessageCommandHelper) => Promise<void>;
};

