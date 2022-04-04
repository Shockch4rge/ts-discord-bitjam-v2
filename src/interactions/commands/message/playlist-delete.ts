import { MessageEmbed } from "discord.js";
import { MessageCommandBuilder } from "djs-message-commands";

import { MessageCommandData } from "../../../types/interactions";


const command: MessageCommandData = {
    builder: new MessageCommandBuilder()
        .setName("playlist-delete")
        .setDescription("Deletes a playlist.")
        .setAliases(["pld", "playlist-remove"]),
    
    execute: async helper => {
        const channel = helper.message.channel;

        await channel.send({
            embeds: [new MessageEmbed()
                .setAuthor({ name: `Select a playlist to delete from the list below:` })
                .setFields()]
        })
    }
}

module.exports = command;