import { ButtonHelper } from '../../helpers/ButtonHelper';

export type ButtonData = {
	id: string;
	execute: (helper: ButtonHelper) => Promise<void>;
};
