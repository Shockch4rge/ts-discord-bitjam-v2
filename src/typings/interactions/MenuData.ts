import { MenuInteractionHelper } from "../../helpers/MenuInteractionHelper";
import { GuardCreator } from "../Guard";


export type MenuData = {
	id: string;

	guards?: GuardCreator[];

	execute: (helper: MenuInteractionHelper) => Promise<void>;
};
