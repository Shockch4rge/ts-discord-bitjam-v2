import { MessageCommandHelper } from '../../helpers/MessageCommandHelper';
import { MessageCommandBuilder } from '../../utils/MessageCommandBuilder';

export type MessageCommandData = {
	builder: MessageCommandBuilder;

	guard?: {
		test: (helper: MessageCommandHelper) => Promise<void>;
		fail: (err: Error, helper: MessageCommandHelper) => Promise<void>;
	};

	execute: (helper: MessageCommandHelper) => Promise<void>;
};
