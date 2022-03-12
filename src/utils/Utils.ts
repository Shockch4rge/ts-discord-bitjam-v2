export class Utils {
	private constructor() {}

	public static delay(ms: number): Promise<unknown> {
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		});
	}
}
