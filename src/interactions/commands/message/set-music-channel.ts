import { Snowflake } from "discord.js";
import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../types/interactions";


const command: MessageCommandData = {
    builder: new MessageCommandBuilder()
        .setName("set-music-channel")
        .setDescription("Sets the music channel to send commands to.")
        .setAliases(["set-channel", "sc"])
        .addChannelOption(option => 
            option
                .setName("channel")
                .setDescription("The channel to set for music commands")),
    
    execute: async helper => {
        const [channelId] = helper.options as [Snowflake];
        
    }
}

module.exports = command;