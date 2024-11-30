const fs = require('fs');
const { twitchClientId, twitchClientSecret  } = require("../Config/config.json");
const { AppTokenAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EmbedBuilder } = require('discord.js');

// Première fonction qui est appelée toutes les minutes
function checkStreamerStatus(client){
    // Récupère la liste des guildes
    const Guilds = client.guilds.cache.map(guild => guild.id);
    // Pour chaque guilde, on va vérifier si un streamer est en live
    Guilds.forEach(guild => {
        // On vérifie si la guilde a un channel de stream défini
        const fileName = `./Code/database/${guild}.json`;
        const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
        if (!data.channels || !data.channels[0] || !data.channels[0].stream) {
            return;
        }
        
        // On récupère la liste des streamers à checker pour cette guilde
        const listStreamers = checkStreamerForThisGuild(guild);
        if (listStreamers === 0) {
            return;
        }

        // Pour chaque streamer, on va vérifier s'il est en live
        listStreamers.forEach(async streamer => {
            const streamInfo = await checkStreamer(streamer.id);
            const isLive = streamInfo !== null;

            // Si le streamer n'est pas en live mais qu'il est marqué comme tel, on envoie une notification de fin de stream
            if(!isLive && streamer.isStreaming){
                await sendNotification(client, streamer, "end", guild);
            }

            // Si le streamer est en live mais qu'il n'est pas marqué comme tel, on envoie une notification de début de stream
            if(isLive && !streamer.isStreaming){
                await sendNotification(client, streamInfo, "begin", guild);
            }
        });
    });
}

// Fonction qui va retourner la liste des streamers à checker pour une guilde donnée (ou 0 si aucun streamer)
function checkStreamerForThisGuild(guildId){
    const fileName = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));

    const streamers = data.streamNotif;
    if (streamers.length === 0) {
        return 0;
    }
    let listStreamers = [];
    streamers.forEach(streamer => {
        listStreamers.push(streamer);
    });
    return listStreamers;
}

// Fonction qui va checker si un streamer est en live
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

// Fonction qui va envoyer une notification de début ou de fin de stream
async function sendNotification(client, streamInfo, type, guildId){
    const fileName = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    const channelId = data.channels[0].stream;

    // Si c'est un début de stream
    if(type === "begin"){
        const gameUrl = await streamInfo.getGame().then(game => game.boxArtUrl.replace('{width}','300').replace('{height}','400'));
        const userName = streamInfo.userDisplayName;
        const userProfilePictureUrl = await streamInfo.getUser().then(user => user.profilePictureUrl);
        const title = streamInfo.title;
        const gameName = streamInfo.gameName;
        const thumbnailUrl = streamInfo.getThumbnailUrl(750, 400);
        
        // Creation de l'embed pour le stream
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
        
        // Mise à jour du fichier de données
        const userId = streamInfo.userId;
        const streamer = data.streamNotif.find(streamer => streamer.id === userId);
        streamer.streamerName = userName;
        streamer.isStreaming = true;
        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(fileName, updatedData);
    }
    // Si c'est une fin de stream
    if(type === "end"){
        // Envoie du message de fin de stream
        const streamerName = streamInfo.streamerName;
        const channel = client.channels.cache.get(channelId);
        await channel.send(`${streamerName} n'est plus en stream.`);

        // Mise à jour du fichier de données
        const userId = streamInfo.id;
        const streamer = data.streamNotif.find(streamer => streamer.id === userId);
        streamer.isStreaming = false;
        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(fileName, updatedData);
    }
}

module.exports = {checkStreamerStatus};