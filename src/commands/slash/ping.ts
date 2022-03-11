import { SlashCommandBuilder } from '@discordjs/builders';

import { SlashCommandData } from '../../types';

module.exports = {
    builder: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Get the latency of the bot."),
    
    execute: async helper => {
        await helper.respond("Hello, world!");
    }
} as SlashCommandData;