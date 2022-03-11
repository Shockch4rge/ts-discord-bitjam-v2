import { MenuHelper } from '../helpers/MenuHelper';

export type MenuData = {
	id: string;

	ephemeral?: boolean;

	guard?: {
		test: (helper: MenuHelper) => Promise<void>;
		fail: (error: Error, helper: MenuHelper) => Promise<void>;
	};

	execute: (helper: MenuHelper) => Promise<void>;
};
