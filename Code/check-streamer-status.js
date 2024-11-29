const fs = require('fs');
const { twitchClientId, twitchClientSecret  } = require("../Config/config.json");
const { AppTokenAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EmbedBuilder } = require('discord.js');


function checkStreamerStatus(client){
    const Guilds = client.guilds.cache.map(guild => guild.id);
    Guilds.forEach(guild => {
        const fileName = `./Code/database/${guild}.json`;
        const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
        
        if (!data.channels || !data.channels[0] || !data.channels[0].stream) {
            //console.warn(`Aucun salon stream défini pour la guilde ${guild}`);
            return;
        }
        

        const listStreamers = checkStreamerForThisGuild(guild);
        if (listStreamers === 0) {
            return;
        }
        listStreamers.forEach(async streamer => {
            const streamInfo = await checkStreamer(streamer.id);
            const isLive = streamInfo !== null;
            if(!isLive && streamer.isStreaming){
                await sendNotification(client, streamer, "end", guild);
            }
            if(isLive && !streamer.isStreaming){
                await sendNotification(client, streamInfo, "begin", guild);
            }
        });
    });
}


function checkStreamerForThisGuild(guildId){
    //console.log("Checking streamer status for guild " + guildId);
    const fileName = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));

    const streamers = data.streamNotif;
    if (streamers.length === 0) {
        return 0;
    }
    let listStreamers = [];
    streamers.forEach(streamer => {
        //console.log("Checking streamer " + streamer.streamerName);
        listStreamers.push(streamer);
    });
    return listStreamers;
}


async function checkStreamer(streamerId){
    const authProvider = new AppTokenAuthProvider(twitchClientId, twitchClientSecret);
    const apiClient = new ApiClient({ authProvider });
    const stream = await apiClient.streams.getStreamByUserId(streamerId)
    if (stream === null) {
        // Is not live
        return null;
    } else {
        // Is live
        return stream;
    }
    
}


async function sendNotification(client, streamInfo, type, guildId){
    const fileName = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    const channelId = data.channels[0].stream;
    if(type === "begin"){
        // Send message to the channel
        const gameUrl = await streamInfo.getGame().then(game => game.boxArtUrl.replace('{width}','300').replace('{height}','400'));
        const userName = streamInfo.userDisplayName;
        const userProfilePictureUrl = await streamInfo.getUser().then(user => user.profilePictureUrl);
        const title = streamInfo.title;
        const gameName = streamInfo.gameName;
        const thumbnailUrl = streamInfo.getThumbnailUrl(750, 400);
        
        const streamEmbed = new EmbedBuilder()
                            .setColor(0xFF00FF)
                            .setThumbnail(`${gameUrl}`)
                            .setAuthor({ name: `${userName}`, iconURL: `${userProfilePictureUrl}`, url: `https://twitch.tv/${userName}` })
                            .setTitle(`${title}`)
                            .setURL(`https://twitch.tv/${userName}`)
                            .addFields({name: "Joue à", value: `${gameName}`})
                            .setImage(`${thumbnailUrl}`)
                            .setTimestamp()
                            .setFooter({text: '4Tip', url: 'https://github.com/ZePandawan/4Tip'});
        const channel = client.channels.cache.get(channelId);
        await channel.send({embeds: [streamEmbed]});
        
        const userId = streamInfo.userId;
        const streamer = data.streamNotif.find(streamer => streamer.id === userId);
        streamer.streamerName = userName;
        streamer.isStreaming = true;
        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(fileName, updatedData);
    }
    if(type === "end"){
        // Send message to the channel
        const streamerName = streamInfo.streamerName;
        const channel = client.channels.cache.get(channelId);
        await channel.send(`${streamerName} n'est plus en stream.`);
        const userId = streamInfo.id;
        const streamer = data.streamNotif.find(streamer => streamer.id === userId);
        streamer.isStreaming = false;
        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(fileName, updatedData);
    }
}

module.exports = {checkStreamerStatus};