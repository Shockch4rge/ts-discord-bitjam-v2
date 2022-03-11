import { GuildMember } from 'discord.js';

import { TrackData } from './TrackData';

export class Track implements TrackData {
	public readonly title: string;
	public readonly artist: string;
	public readonly trackUrl: string;
	public readonly imageUrl: string;
	public readonly duration: number;
	public readonly requester: GuildMember;

	public constructor(data: TrackData) {
		this.title = data.title;
		this.artist = data.artist;
		this.trackUrl = data.trackUrl;
		this.imageUrl = data.imageUrl;
		this.duration = data.duration;
		this.requester = data.requester;
	}
}
