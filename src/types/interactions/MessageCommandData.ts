import { MessageInteractionHelper } from "../../helpers/MessageInteractionHelper";
import { Guard, GuardCreator } from "../Guard";


import type { MessageCommandBuilder } from "djs-message-commands";

export type MessageCommandData = {
	builder: MessageCommandBuilder;

	guards?: GuardCreator[];

	execute: (helper: MessageInteractionHelper) => Promise<void>;
};
