import { ButtonHelper } from "../../helpers/ButtonInteractionHelper";
import { GuardCreator } from "../Guard";


export type ButtonData = {
	id: string;

	guards?: GuardCreator[];

	execute: (helper: ButtonHelper) => Promise<void>;
};
