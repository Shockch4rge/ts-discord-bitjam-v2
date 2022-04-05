declare global {
	type Constructor<T extends {}> = new (...args: any[]) => T;
}

export {};
