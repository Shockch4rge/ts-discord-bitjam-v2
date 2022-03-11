import { GuildMember } from 'discord.js';

export interface TrackData {
	title: string;
	artist: string;
	trackUrl: string;
	imageUrl: string;
	duration: number;
	requester: GuildMember;
}
