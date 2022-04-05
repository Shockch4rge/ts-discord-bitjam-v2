import { GuildMember, Interaction, Message } from "discord.js";

import GuildCache from "../../app/GuildCache";
import { Guard, GuardCreator } from "../../types/Guard";


export class BotVoiceChannelOnly extends Guard {

	public constructor() {
		super({
			name: "BotVoiceChannelOnly",
			message: "You need to be in a voice channel with the bot to use this command.",
		});
	}

	public async execute(cache: GuildCache, interaction: Message | Interaction): Promise<boolean> {
		const member = interaction.member as GuildMember;
		const vc = member.voice.channel;

		return !!vc && vc.id === cache.guild.me!.voice.channelId!;
	}
}
