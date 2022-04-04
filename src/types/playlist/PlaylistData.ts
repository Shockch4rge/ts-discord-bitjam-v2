import { Track } from "../track";


export interface PlaylistData {
	name: string;
    tracks: Track[];
    createdAt: Date;
}
