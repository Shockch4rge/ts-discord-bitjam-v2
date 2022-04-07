import { ContextMenuInteractionHelper } from "../../helpers/ContextMenuHelper";


export type ContextMenuData = {
	ephemeral?: boolean;
	/**
	 * doesn't allow '/' in name
	 */
	name: string;
	description: string;
	type: "user" | "message" | "client";
	execute: (helper: ContextMenuInteractionHelper) => Promise<void>;
};
