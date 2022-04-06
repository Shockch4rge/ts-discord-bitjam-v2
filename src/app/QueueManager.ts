import { Track } from "../typings/track";
import { BitjamError } from "../utils/BitJamError";


export class QueueManager {
	public tracks: Track[];

	public constructor() {
		this.tracks = [];
	}

	public enqueue(tracks: Track | Track[]) {
		if (Array.isArray(tracks)) {
			this.tracks.push(...tracks);
			return;
		}

		this.tracks.push(tracks);
	}

	public dequeue(tracks: Track | Track[]) {}

	public clear() {
		if (this.tracks.length <= 0) {
			throw new BitjamError.QueueEmptyError();
		}

		this.tracks = [];
	}

	public replace() {}

	public get(index: number) {
		if (index >= this.tracks.length || index < 0) {
			throw new BitjamError.QueueIndexOutOfBoundsError();
		}

		return this.tracks[index];
	}
}
