import { Track } from "../typings/track";
import { BitjamErrors } from "../utils/BitjamErrors";
import { Either, left, right } from "../utils/Either";


export class Queue<T> {
	private items: T[] = [];

	get length() {
		return this.items.length;
	}

	public enqueue(items: T | T[]) {
		if (Array.isArray(items)) {
			this.items.push(...items);
			return right(undefined);
		}

		this.items.push(items);
		return right(undefined);
	}

	public first(): Either<Error, T> {
		if (this.isEmpty()) {
			return left(new BitjamErrors.QueueEmptyError());
		}

		return right(this.items[0]);
	}

	public dequeue(quantity: number): Either<Error, void> {
		if (this.isEmpty()) {
			return left(new BitjamErrors.QueueEmptyError());
		}

		if (this.isIndexOutOfBounds(quantity)) {
			return left(new BitjamErrors.QueueIndexOutOfBoundsError());
		}

		return right(void this.items.splice(0, quantity));
	}

	public clear(): Either<Error, void> {
		if (this.isEmpty()) {
			return left(new BitjamErrors.QueueEmptyError());
		}

		this.items.splice(0, this.items.length);
		return right(undefined);
	}

	public remove(searchElement: T): Either<Error, T> {
		if (this.isEmpty()) {
			return left(new BitjamErrors.QueueEmptyError());
		}

		const index = this.items.indexOf(searchElement);

		if (index === -1) {
			return left(new BitjamErrors.TrackNotFoundError());
		}

		const removedItem = this.items.splice(index, 1)[0];
		return right(removedItem);
	}

	public portion(fromIndex: number, toIndex: number) {
		if (this.isIndexOutOfBounds(fromIndex) || this.isIndexOutOfBounds(toIndex)) {
			throw new BitjamErrors.QueueIndexOutOfBoundsError();
		}

		if (fromIndex < toIndex) {
			const range = toIndex - fromIndex;
			this.items.splice(fromIndex, range);
			return right(undefined);
		}

		if (fromIndex > toIndex) {
			const range = fromIndex - toIndex;
			this.items.splice(toIndex, range);
			return right(undefined);
		}

		this.items.splice(fromIndex, 1);
		return right(undefined);
	}

	public sweep(searchElement: T) {
		for (let i = 0; i < this.items.length; i++) {
			const index = this.items.indexOf(searchElement);

			if (index === -1) {
				return left(new BitjamErrors.TrackNotFoundError());
			}

			if (index === i) {
				this.items.splice(i, 1);
				return right(undefined);
			}
		}
	}

	public shuffle() {
		if (this.items.length === 1) return right(undefined);

		for (let i = this.items.length - 1; i > 1; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.items[i], this.items[j]] = [this.items[j], this.items[i]];
		}
	}

	public swap(searchIndex: number, withIndex: number): void {
		if (searchIndex < 0 || searchIndex >= this.items.length) return;

		const searchElement = this.items.at(searchIndex);
		const withElement = this.items.at(withIndex);

		if (!searchElement) return;
		if (!withElement) return;

		this.items.splice(searchIndex, 1, withElement);
		this.items.splice(withIndex, 1, searchElement);
	}

	public replace(searchIndex: number, withItem: T): void {
		this.items.splice(searchIndex, 1, withItem);
	}

	public move(fromIndex: number, toIndex: number) {
		if (fromIndex === toIndex) return;

		const removed = this.items.splice(fromIndex, 1)[0];
		this.items.splice(toIndex, 0, removed);
	}

	public get(index: number) {
		if (this.isIndexOutOfBounds(index)) {
			throw new BitjamErrors.QueueIndexOutOfBoundsError();
		}

		return this.items[index];
	}

	// method to check if index is lesser or greater than length
	private isIndexOutOfBounds(index: number) {
		return index >= this.items.length || index < 0;
	}

	private isEmpty() {
		return this.items.length <= 0;
	}
}
