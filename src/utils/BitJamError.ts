export namespace BitjamError {
	abstract class BitjamError extends Error {
		public override name = "UNKNOWN";
		public override message = "There was an unknown error.";
	}

	export class UnknownError extends BitjamError {}

	export class VoiceConnectionError extends BitjamError {
		public override name = "VOICE_CONNECTION_ERROR";
		public override message = "There was an error while starting the Voice Stream";
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

	// #region queue errors
	export class QueueEmptyError extends BitjamError {
		public override name = "QUEUE_EMPTY";
		public override message = "The queue is empty.";
	}
	// #endregion

	export class NothingPlayingError extends BitjamError {
		public override name = "NOTHING_PLAYING";
		public override message = "There is currently no song playing in the voice channel.";
	}

	export class ChannelTypeInvalidError extends BitjamError {
		public override name = "CHANNEL_TYPE_INVALID";
		public override message = "The channel type is invalid.";
	}

	export class ResourceNotReadyError extends BitjamError {
		public override name = "RESOURCE_NOT_READY";
		public override message = "The audio resource is not ready.";
	}

	export class PlayFailureError extends BitjamError {
		public override name = "PLAY_FAILURE";
		public override message = "There was an error while attempting to play the audio.";
	}

	export class PauseFailureError extends BitjamError {
		public override name = "PAUSE_FAILURE";
		public override message = "There was an error while attempting to pause the audio.";
	}

	export class ResumeFailureError extends BitjamError {
		public override name = "RESUME_FAILURE";
		public override message = "There was an error while attempting to resume the audio.";
	}

	export class StopFailureError extends BitjamError {
		public override name = "STOP_FAILURE";
		public override message = "There was an error while attempting to stop the player.";
	}

	export class AlreadyPlayingError extends BitjamError {
		public override name = "ALREADY_PLAYING";
		public override message = "The player is currently playing.";
	}

	export class AlreadyPausedError extends BitjamError {
		public override name = "ALREADY_PAUSED";
		public override message = "The player is currently paused.";
	}

	export class AlreadyStoppedError extends BitjamError {
		public override name = "ALREADY_STOPPED";
		public override message = "The player is currently idle.";
	}
}
