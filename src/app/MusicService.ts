import { GuildMember } from 'discord.js';

import {
    AudioPlayer, AudioPlayerStatus, DiscordGatewayAdapterCreator, entersState, joinVoiceChannel,
    PlayerSubscription, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus
} from '@discordjs/voice';

import { Track } from '../types/track';
import { BitjamError } from '../utils/BitJamError';
import { Utils } from '../utils/Utils';

export default class MusicService {
	/**
	 * Initialise the connection through a method to prevent scoping problems
	 */
	public connection?: VoiceConnection;
	public subscription?: PlayerSubscription;
	public readyLock: boolean;
	public queueLock: boolean;
	public loopState: "none" | "track" | "queue";
	public queue: Track[];
	public readonly player: AudioPlayer;

	public constructor() {
		this.readyLock = false;
		this.queueLock = false;
		this.loopState = "none";
		this.queue = [];
		this.player = new AudioPlayer();
	}

	/**
	 * Establish a voice connection through a member and subscribes the AudioPlayer to the channel.
	 * @param member An active member in a voice channel
	 */
	public createConnection(member: GuildMember) {
		if (this.connection) {
			throw new BitjamError.AlreadyEstablishedVoiceConnectionError();
		}

		this.connection = joinVoiceChannel({
			guildId: member.guild.id!,
			channelId: member.voice.channelId!,
			adapterCreator: member.guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator,
		});

		this.subscription = this.connection.subscribe(this.player)!;

		this.connection.on<"stateChange">("stateChange", async (_, newState) => {
			if (newState.status === VoiceConnectionStatus.Disconnected) {
				if (
					newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
					newState.closeCode === 4014
				) {
					/**
					 * If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
					 * but there is a chance the connection will recover itself if the reason of the disconnect was due to
					 * switching voice channels. This is also the same code for the bot being kicked from the voice channel,
					 * so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
					 * the voice connection.
					 */
					try {
						// Probably moved voice channel
						await entersState(this.connection!, VoiceConnectionStatus.Connecting, 5_000);
					} catch {
						// Probably removed from voice channel
						this.destroyConnection();
					}
				} else if (this.connection!.rejoinAttempts < 5) {
					/**
					 * The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
					 */
					await Utils.delay((this.connection!.rejoinAttempts + 1) * 5_000);
					this.connection!.rejoin();
				} else {
					/**
					 * The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
					 */
					this.destroyConnection();
				}
			} else if (newState.status === VoiceConnectionStatus.Destroyed) {
				/**
				 * Once destroyed, stop the subscription.
				 */
				this.subscription!.unsubscribe();
			} else if (
				!this.readyLock &&
				(newState.status === VoiceConnectionStatus.Connecting ||
					newState.status === VoiceConnectionStatus.Signalling)
			) {
				/**
				 * In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
				 * before destroying the voice connection. This stops the voice connection permanently existing in one of these
				 * states.
				 */
				this.readyLock = true;
				try {
					await entersState(this.connection!, VoiceConnectionStatus.Ready, 20_000);
				} catch {
					if (this.connection!.state.status !== VoiceConnectionStatus.Destroyed)
						this.connection!.destroy();
				} finally {
					this.readyLock = false;
				}
			}
		});

		return this.connection;
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

	public async play() {}

	public async playFirst() {
		if (this.queue.length <= 0) {
			throw new BitjamError.QueueEmptyError();
		}

		const track = this.queue[0];
		track.createAudioResource();
	}

	public async pause() {
		if (this.player.state.status === AudioPlayerStatus.Paused) {
			throw new BitjamError.AlreadyPausedError();
		}

		const pauseSuccess = this.player.pause();

		if (!pauseSuccess) {
			throw new BitjamError.PauseFailureError();
		}
	}

	public async resume() {
		if (this.player.state.status === AudioPlayerStatus.Playing) {
			throw new BitjamError.AlreadyPlayingError();
		}

		const resumeSuccess = this.player.unpause();

		if (!resumeSuccess) {
			throw new BitjamError.ResumeFailureError();
		}
	}

	private async _stop() {
		if (this.player.state.status === AudioPlayerStatus.Idle) {
			throw new BitjamError.AlreadyStoppedError();
		}

		const stopSuccess = this.player.stop();

		if (!stopSuccess) {
			throw new BitjamError.StopFailureError();
		}
	}

	public async clearQueue() {
		if (this.queue.length <= 0) {
			throw new BitjamError.QueueEmptyError();
		}

		await this._stop();
		this.queue = [];
	}
}
