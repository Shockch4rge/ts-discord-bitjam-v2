import { SlashCommandBuilder } from '@discordjs/builders';

import { SlashCommandData } from '../../types/data';

const command: SlashCommandData = {
    builder: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song, if there is one."),
    
    execute: async helper => {
        
    }
}

module.exports = command;