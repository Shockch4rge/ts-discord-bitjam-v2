export class Arrays {
	private constructor() {}

	/**
	 * Removes an element from an array. This method modifies the array.
	 *
	 * @param {T} searchElement The element to remove
	 * @param {T[]} from The element source
	 */
	public static remove<T>(searchElement: T, from: T[]) {
		const index = from.indexOf(searchElement);

		if (index === -1) return;

		from.splice(index, 1);
	}

	/**
	 * Splices a portion/range of elements in an array. This method modifies the array.
	 * @param {number} fromIndex
	 * @param {number} toIndex
	 * @param {T[]} array
	 */
	public static portion<T>(fromIndex: number, toIndex: number, array: T[]) {
		if (fromIndex < toIndex) {
			const range = toIndex - fromIndex;
			array.splice(fromIndex, range);
		} else if (fromIndex > toIndex) {
			const range = fromIndex - toIndex;
			array.splice(toIndex, range);
		} else {
			array.splice(fromIndex, 1);
		}
	}

	/**
	 * Remove all instances of a specific element from an array. This method modifies the array.
	 * @param {T} searchElement The element to remove
	 * @param {T[]} from The element source
	 */
	public static sweep<T>(searchElement: T, from: T[]) {
		for (let i = 0; i < from.length; i++) {
			const index = from.indexOf(searchElement);

			if (index === -1) return;

			if (index === i) {
				from.splice(i, 1);
			}
		}
	}

	/**
	 * Shuffle an array randomly, excluding the first element. This method modifies the array.
	 * @param {T[]} array The array to shuffle
	 */
	public static shuffle<T>(array: T[]) {
		if (array.length === 1) return;

		for (let i = array.length - 1; i > 1; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	/**
	 * Clear an array completely. This method modifies the array.
	 * @param {T[]} array The array to clear
	 */
	public static clear<T>(array: T[]): void {
		void array.splice(0);
	}

	/**
	 * Swap an element with another one in an array. Doesn't do anything if the elements are not found.
	 * @param searchIndex
	 * @param withIndex
	 * @param {T[]} array The array to modify
	 */
	public static swap<T>(searchIndex: number, withIndex: number, array: T[]): void {
		if (searchIndex < 0 || searchIndex >= array.length) return;

		const searchElement = array.at(searchIndex);
		const withElement = array.at(withIndex);

		if (!searchElement) return;
		if (!withElement) return;

		array.splice(searchIndex, 1, withElement);
		array.splice(withIndex, 1, searchElement);
	}

	/**
	 * Replace an element with a specified one in an array. Doesn't do anything if the specified one is not found.
	 * @param searchIndex The index to replace
	 * @param {T} _with The element to swap with
	 * @param {T[]} array The array to modify
	 */
	public static replace<T>(searchIndex: number, _with: T, array: T[]): void {
		array.splice(searchIndex, 1, _with);
	}

	public static move<T>(fromIndex: number, toIndex: number, array: T[]) {
		if (fromIndex === toIndex) return;

		const removed = array.splice(fromIndex, 1)[0];
		void array.splice(toIndex, 0, removed);
	}
}
