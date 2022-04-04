import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../types/interactions";


const command: MessageCommandData = {
    builder: new MessageCommandBuilder()
        .setName("play")
        .setDescription("Play a song.")
        .setAliases(["p"])
        .addStringOption(option =>
            option.setName("query").setDescription("Query for the song")),
    
    execute: async helper => {
        const [query] = helper.options as [string];
        await helper.respond(`Playing ${query}`);
    }
}

module.exports = command;