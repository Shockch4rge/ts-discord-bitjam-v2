import { SelectMenuInteractionHelper } from "../../helpers/SelectMenuInteractionHelper";
import { GuardCreator } from "../Guard";


export type SelectMenuData = {
	id: string;

	guards?: GuardCreator[];

	execute: (helper: SelectMenuInteractionHelper) => Promise<void>;
};
