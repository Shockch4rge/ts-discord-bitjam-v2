import YTMusic from "ytmusic-api";

import { Track } from "../types/track";


export class TrackSearcher {
	private readonly youtubeAPI: YTMusic;

	public constructor() {
		this.youtubeAPI = new YTMusic();
		this.youtubeAPI.initialize();
	}

	public async getSearchSuggestions(query: string) {
		return await this.youtubeAPI.getSearchSuggestions(query);
	}

	public async searchYoutubeQuery(query: string) {
		const results = await this.youtubeAPI.search(query, "VIDEO");

		return results.slice(0, 10).map(
			result =>
				new Track({
					title: result.name,
					artist: result.artists.map(a => a.name).join(", "),
					duration: result.duration,
					trackUrl: `https://youtu.be/${result.videoId}`,
					imageUrl: result.thumbnails[0].url,
				})
		);
	}

	public async getYoutubeTrack(id: string) {
		const result = await this.youtubeAPI.getSong(id);

		return new Track({
			title: result.name,
			artist: result.artists.join(", "),
			duration: result.duration,
			trackUrl: `https://youtu.be/${result.videoId}`,
			imageUrl: result.thumbnails[0].url,
		});
	}
}
