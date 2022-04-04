import GuildCache from "../../app/GuildCache";
import { Guard } from "../../types/Guard";


export class BotNeedsVoiceConnection extends Guard {
    public constructor() {
        super({
			name: "BotNeedsVoiceConnection",
			message: "The bot isn't connected to a voice channel!",
		});
    }

    public async execute(cache: GuildCache): Promise<boolean> {
        return !!cache.music.connection;
    }
}