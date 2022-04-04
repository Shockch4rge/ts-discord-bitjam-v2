import { SlashCommandBuilder } from "@discordjs/builders";

import { SlashCommandData } from "../../../types/interactions";


const command: SlashCommandData = {
    builder: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the current queue."),
    
    execute: async helper => {
        
    }
    
}

module.exports = command;