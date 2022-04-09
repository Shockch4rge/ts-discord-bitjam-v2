export namespace BitjamErrors {
	abstract class BitjamError extends Error {
		public override name = "UNKNOWN";
		public override message = "There was an unknown error.";
	}

	export class UnknownError extends BitjamError {}

	// #region voice connection errors
	export class VoiceConnectionError extends BitjamError {
		public override name = "VOICE_CONNECTION_ERROR";
		public override message = "There was an error while starting the voice stream";
	}

	export class UnknownVoiceError extends BitjamError {
		public override name = "UNKNOWN_VOICE";
		public override message = "There was an unknown error while attempting to join the voice channel.";
	}

	export class NoVoiceConnectionError extends BitjamError {
		public override name = "NO_VOICE_CONNECTION";
		public override message = "There is no voice connection.";
	}

	export class AlreadyEstablishedVoiceConnectionError extends BitjamError {
		public override name = "ALREADY_ESTABLISHED_VOICE_CONNECTION";
		public override message = "There is already an established voice connection.";
	}
	// #endregion

	// #region queue errors
	export class QueueEmptyError extends BitjamError {
		public override name = "QUEUE_EMPTY";
		public override message = "The queue is empty.";
	}

	export class QueueIndexOutOfBoundsError extends BitjamError {
		public override name = "QUEUE_INDEX_OUT_OF_BOUNDS";
		public override message = "The index is out of bounds.";
	}

	export class TrackNotFoundError extends BitjamError {
		public override name = "TRACK_NOT_FOUND";
		public override message = "The track was not found in the queue.";
	}
	// #endregion

	// #region track errors
	export class ResourceNotReadyError extends BitjamError {
		public override name = "TRACK_RESOURCE_NOT_READY";
		public override message = "The audio resource is not ready.";
	}
	// #endregion

	// #region player errors
	export class PlayFailureError extends BitjamError {
		public override name = "PLAY_FAILURE";
		public override message = "There was an error while attempting to play the audio.";
	}

	export class PauseFailureError extends BitjamError {
		public override name = "PLAYER_PAUSE_FAILURE";
		public override message = "There was an error while attempting to pause the audio.";
	}

	export class ResumeFailureError extends BitjamError {
		public override name = "PLAYER_RESUME_FAILURE";
		public override message = "There was an error while attempting to resume the audio.";
	}

	export class StopFailureError extends BitjamError {
		public override name = "PLAYER_STOP_FAILURE";
		public override message = "There was an error while attempting to stop the player.";
	}

	export class AlreadyPlayingError extends BitjamError {
		public override name = "PLAYER_ALREADY_PLAYING";
		public override message = "The player is currently playing.";
	}

	export class AlreadyPausedError extends BitjamError {
		public override name = "PLAYER_ALREADY_PAUSED";
		public override message = "The player is currently paused.";
	}

	export class AlreadyStoppedError extends BitjamError {
		public override name = "PLAYER_ALREADY_STOPPED";
		public override message = "The player is currently idle.";
	}

	export class NothingPlayingError extends BitjamError {
		public override name = "PLAYER_NOTHING_PLAYING";
		public override message = "There is currently no song playing in the voice channel.";
	}

	// #endregion

	// #region admin errors
	export class MissingPermissionsError extends BitjamError {
		public override name = "MISSING_PERMISSIONS";

		public constructor(permission: string[]) {
			super(`You do not have the required permission(s): ${permission}`);
		}
	}

	export class MissingRolesError extends BitjamError {
		public override name = "MISSING_ROLES";
		public override message = "You do not have the required roles.";

		public constructor(roleName: string) {
			super(`You do not have the required roles(s): ${roleName}`);
		}
	}

	export class ChannelTypeInvalidError extends BitjamError {
		public override name = "CHANNEL_TYPE_INVALID";
		public override message = "The channel type is invalid.";
	}

	// #endregion
}