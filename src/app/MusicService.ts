import { Utils } from "../utils/Utils";
import { GuildMember } from "discord.js";

import {
    AudioPlayer, AudioPlayerStatus, DiscordGatewayAdapterCreator, entersState, joinVoiceChannel,
    PlayerSubscription, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionState,
    VoiceConnectionStatus
} from "@discordjs/voice";

import { Track } from "../typings/track";
import { BitjamError } from "../utils/BitJamError";
import { QueueManager } from "./QueueManager";
import { TrackSearcher } from "./TrackSearcher";


export default class MusicService {
	public connection?: VoiceConnection;
	public subscription?: PlayerSubscription;
	public loopState: "none" | "track" | "queue";
	public readonly tracks: TrackSearcher;
	public readonly queue: QueueManager;
	public readonly player: AudioPlayer;
	private readyLock: boolean;

	public constructor() {
		this.readyLock = false;
		this.loopState = "none";
		this.queue = new QueueManager();
		this.player = new AudioPlayer();
		this.tracks = new TrackSearcher();
	}

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
		this.connection.on<"stateChange">("stateChange", this.handleConnectionState);

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

	private async handleConnectionState(_: VoiceConnectionState, newState: VoiceConnectionState) {
		if (newState.status === VoiceConnectionStatus.Disconnected) {
			if (
				newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
				newState.closeCode === 4014
			) {
				try {
					await entersState(this.connection!, VoiceConnectionStatus.Connecting, 5_000);
				} catch {
					this.destroyConnection();
				}
			} else if (this.connection!.rejoinAttempts < 5) {
				await Utils.delay((this.connection!.rejoinAttempts + 1) * 5_000);
				this.connection!.rejoin();
			} else {
				this.destroyConnection();
			}
		} else if (newState.status === VoiceConnectionStatus.Destroyed) {
			this.subscription!.unsubscribe();
		} else if (
			!this.readyLock &&
			(newState.status === VoiceConnectionStatus.Connecting ||
				newState.status === VoiceConnectionStatus.Signalling)
		) {
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
	}

	public async play(tracks: Track | Track[]) {
		this.queue.enqueue(tracks);
	}

	public async replay() {
		const track = this.queue.get(0);
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

	public async stop() {
		if (this.player.state.status === AudioPlayerStatus.Idle) {
			throw new BitjamError.AlreadyStoppedError();
		}

		const stopSuccess = this.player.stop();

		if (!stopSuccess) {
			throw new BitjamError.StopFailureError();
		}
	}

	public async clearQueue() {
		this.queue.clear();
		await this.stop();
	}
}
