export type Either<L, A> = Left<L, A> | Right<L, A>;

export class Left<L, A> {
	readonly value: L;

	constructor(value: L) {
		this.value = value;
	}

	err(): this is Left<L, A> {
		return true;
	}

	ok(): this is Right<L, A> {
		return false;
	}

	unwrap(map?: (value: L) => unknown) {
		if (map) {
			map(this.value);
		}

		return this.value;
	}
}

export class Right<L, A> {
	readonly value: A;

	constructor(value: A) {
		this.value = value;
	}

	err(): this is Left<L, A> {
		return false;
	}

	ok(): this is Right<L, A> {
		return true;
    }
    
    unwrap(map?: (value: A) => unknown) {
        if (map) {
            map(this.value);
        }

        return this.value;
    }
}

export const left = <L, A>(l: L): Either<L, A> => {
	return new Left(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
	return new Right<L, A>(a);
};
