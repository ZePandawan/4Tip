const { twitchClientId, twitchClientSecret  } = require("../../Config/config.json");
const { AppTokenAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");
const fs = require("fs");
const {EmbedBuilder} = require('discord.js');

exports.run = async (client, interaction) => {
    const guildId = interaction.guildId;
    const guildName = interaction.guild.name;
    const dbFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, "utf-8"));

    let streamers = "";


    
    

    data.streamNotif.forEach(streamer => {
        streamers += `${streamer.streamerName}\n`;
    });

    if(streamers.length === ""){
        interaction.reply("Aucun streamer dans la liste !");
        return;
    }

    
    const streamEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Streamer serveur ${guildName}`)
        .addFields({name: `Liste streamer :`, value: `${streamers}`})
        .setTimestamp()
        .setFooter({text: '4Tip'});
    await interaction.reply({embeds: [streamEmbed]});





    
}