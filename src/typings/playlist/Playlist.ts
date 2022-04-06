import { Track } from "../track";


export class Playlist implements PlaylistData {
    public readonly name: string;
    public readonly trackUrls: string[];
    public readonly createdAt: Date;

    public constructor(data: PlaylistData) {
        this.name = data.name;
        this.trackUrls = data.trackUrls;
        this.createdAt = data.createdAt;
    }
}

export interface PlaylistData {
    name: string;
    trackUrls: string[];
    createdAt: Date;
}