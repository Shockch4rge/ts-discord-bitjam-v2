import { SlashCommandBuilder } from "@discordjs/builders";

import { SlashInteractionHelper } from "../../helpers/SlashInteractionHelper";
import { GuardCreator } from "../Guard";


export type SlashCommandData = {
	ephemeral?: boolean;

	builder: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

	guards?: GuardCreator[];

	execute: (helper: SlashInteractionHelper) => Promise<void>;
};
