import {
    AudioPlayer, PlayerSubscription, VoiceConnection, VoiceConnectionStatus
} from '@discordjs/voice';

import { Track } from '../types/track';

export default class MusicService {
	/**
	 * Initialise the connection through a method to prevent scoping problems
	 */
	public connection?: VoiceConnection;
	public subscription?: PlayerSubscription;
	public readonly player: AudioPlayer;
	public readonly queue: Track[];

	public constructor() {
		this.player = new AudioPlayer();
		this.queue = [];
	}

	public createConnection(connection: VoiceConnection) {
		this.connection = connection;
		this.subscription = this.connection.subscribe(this.player)!;
	}

	public destroyConnection() {
		if (this.connection) {
			if (this.subscription) {
				this.subscription.unsubscribe();
				this.subscription = undefined;
			}
			this.connection.destroy();
			this.connection = undefined;
		}
	}
}
