import { MessageCommandHelper } from "../../helpers/MessageCommandHelper";
import { Guard } from "../Guard";


import type { MessageCommandBuilder } from 'djs-message-commands';
export type MessageCommandData = {
	builder: MessageCommandBuilder;

	guards?: Guard[];

	execute: (helper: MessageCommandHelper) => Promise<void>;
};