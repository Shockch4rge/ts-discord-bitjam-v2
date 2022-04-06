import { ContextMenuInteractionHelper } from "../../helpers/ContextMenuHelper";


export type ContextMenuData = {
	name: string;
	type: "user" | "message" | "client";
	execute: (helper: ContextMenuInteractionHelper) => Promise<void>;
};
