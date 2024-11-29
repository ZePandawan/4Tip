// FR : Ajout de la classe discord.js dans mon répertoire + de mon token dans mon fichier config.json
// EN : Require the necessary discord.js classes
const { Client, Intents, GatewayIntentBits, Collection, MessageMentions, GuildMemberManager, EmbedBuilder, Activity, ActivityType} = require('discord.js');
const { token, twitchClientId, twitchClientSecret  } = require("../Config/config.json");
const fs = require("fs");
const {checkAdmin, getChannelId, createDatabase} = require("./functions");
const { StaticAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { checkStreamerStatus } = require('./check-streamer-status');


const statuses = [
    { name: "MazaStream.fr", type: ActivityType.Watching },
    { name: "twitch.tv/russfx_", type: ActivityType.Watching },
    { name: "twitch.tv/zepandawan", type: ActivityType.Watching }
];
let count_status = 0;


// FR : Créer une nouvelle instance de client
// EN : Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences] });

//const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES,]})


client.commands = new Collection();
const commandFiles = fs.readdirSync('./Code/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    let commandConfig = require(`./commands/${file}`);
    client.commands.set(file.replace('.js', ''), commandConfig);
}

// FR : Une fois que le client est prêt, le code ci-dessous va être exécuté (une seule fois)
// EN : When the client is ready, run this code (only once)
client.once('ready',() => {

    // FR : Initialisation de l'API Twitch
    // EN : Initialize the Twitch API
    //const authProvider = new StaticAuthProvider(twitchClientId, twitchClientSecret);
    //const apiClient = new ApiClient({ authProvider });

    setInterval(() => {
        checkStreamerStatus(client);
    }, 10000);
    


    // FR : Vérification des serveurs et création de la base de données si elle n'existe pas
    // EN : Check the servers and create the database if it doesn't exist
    const Guilds = client.guilds.cache.map(guild => guild.id);
    console.log(Guilds);
    Guilds.forEach(guildId => {
        createDatabase(guildId);
    });
    console.log("Je suis prêt !");
    
    // FR : Changement de statut du bot toutes les 30 secondes
    // EN : Change the bot's status every 30 seconds
    setInterval(() => {
        let randomStatus = statuses[count_status];
        count_status !== statuses.length-1 ? count_status++ : count_status = 0;
        client.user.setActivity(randomStatus);
    }, 30000);


    /*
    setInterval(()=>{
        const dataFile = "./Code/database/4Tip.json";
        const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));

        for(let i=0; i< data.streamer_notif.length; i++){
            isStreamLive(data.streamer_notif[i].streamerName).then(async result => {
                if (data.streamer_notif[i].isStreaming === 0 && result === true) {
                    // Cas où le streamer est en stream mais pas encore de ping
                    data.streamer_notif[i].isStreaming = 1;
                    const updatedData = JSON.stringify(data, null, 2);
                    fs.writeFileSync(dataFile, updatedData);
                    apiClient.helix.streams.getStreamByUserName(data.streamer_notif[i].streamerName).then(async stream => {
                        const user = await stream.getUser();
                        const game = await stream.getGame();
                        const gameUrl = game.boxArtUrl.replace('{width}','250').replace('{height}','400');
                        console.log(`Game : ${gameUrl}`);

                        const thumbnailUrl = stream.getThumbnailUrl(750, 400);
                        const streamEmbed = new EmbedBuilder()
                            .setColor(0xFF00FF)
                            .setThumbnail(`${gameUrl}`)
                            .setAuthor({ name: `${data.streamer_notif[i].streamerName}`, iconURL: `${user.profilePictureUrl}`, url: `https://twitch.tv/${data.streamer_notif[i].streamerName}` })
                            .setTitle(`${stream.title}`)
                            .setURL(`https://twitch.tv/${data.streamer_notif[i].streamerName}`)
                            .addFields({name: "Joue à", value: `${game.name}`})
                            .setImage(`${thumbnailUrl}`)
                            .setTimestamp()
                            .setFooter({text: '4Tip', url: 'https://github.com/ZePandawan/4Tip'});
                        const channel = client.channels.cache.get("1136560773674577930");
                        await channel.send({embeds: [streamEmbed]});
                    });
                } else {
                    if (data.streamer_notif[i].isStreaming === 1 && result === false) {
                        // Cas où le streamer n'est plus en stream
                        data.streamer_notif[i].isStreaming = 0;
                        const updatedData = JSON.stringify(data, null, 2);
                        fs.writeFileSync(dataFile, updatedData);
                    }
                }
            })
        }
    }, 10000);
    */

});


// FR : C'est ici que l'on va avoir le code des différentes commandes qui sont utilisées par le bot
// EN : It's the place where we can find the code of differents commands which are used by the botw
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    //console.log(interaction);
    //console.log(interaction.guild.members.fetch());


    if(client.commands.has(commandName)){
        client.commands.get(commandName).run(client, interaction).catch(console.error);
    }
});

// Dès que le bot rejoint un serveur, on crée la base de données
client.on('guildCreate', guild => {
    createDatabase(guild.id);
});



/*
client.on('guildMemberAdd', member => {
    const idChannel = getChannelId("welcome",member.guild.id);
    //console.log(idChannel);
    member.guild.channels.cache.find(i => i.id == idChannel).send(`Bienvenue dans la meute <@${member.user.id}> !`);
})

client.on('guildMemberRemove', member =>{
    const idChannel = getChannelId("welcome",member.guild.id);
    //console.log(idChannel);
    member.guild.channels.cache.find(i => i.id == idChannel).send(`${member.user.displayName} a décidé de s'en aller ...`);
})
*/

// FR : Connexion à Discord grâce au token de notre client
// EN : Login to Discord with your client's token
client.login(token);