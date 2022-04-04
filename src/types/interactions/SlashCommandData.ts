import { SlashCommandBuilder } from "@discordjs/builders";

import { SlashCommandHelper } from "../../helpers/SlashCommandHelper";
import { Guard } from "../Guard";

export type SlashCommandData = {
	ephemeral?: boolean;

	builder: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

	guards?: Guard[];

	execute: (helper: SlashCommandHelper) => Promise<void>;
};
