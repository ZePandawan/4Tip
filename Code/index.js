// FR : Ajout de la classe discord.js dans mon répertoire + de mon token dans mon fichier config.json
// EN : Require the necessary discord.js classes
const { Client, Intents, GatewayIntentBits, Collection, MessageMentions, GuildMemberManager, EmbedBuilder, Activity, ActivityType} = require('discord.js');
const { token, twitchClientId, twitchClientSecret  } = require("../Config/config.json");
const fs = require("fs");
const {checkAdmin, getChannelId, createDatabase} = require("./functions");
const { checkStreamerStatus } = require('./check-streamer-status');


const statuses = [
    //{ name: "MazaStream.fr", type: ActivityType.Watching },
    //{ name: "twitch.tv/russfx_", type: ActivityType.Watching },
    { name: "twitch.tv/zepandawan", type: ActivityType.Watching },
    { name: "son code", type: ActivityType.Watching }
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


client.commands = new Collection();
const commandFiles = fs.readdirSync('./Code/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    let commandConfig = require(`./commands/${file}`);
    client.commands.set(file.replace('.js', ''), commandConfig);
}

// FR : Une fois que le client est prêt, le code ci-dessous va être exécuté (une seule fois)
// EN : When the client is ready, run this code (only once)
client.once('ready',() => {

    // FR : Vérification du statut des streamers toutes les minutes
    // EN : Check the streamers status every minutes
    setInterval(() => {
        checkStreamerStatus(client);
    }, 60000);
    


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

});


// FR : C'est ici que l'on va avoir le code des différentes commandes qui sont utilisées par le bot
// EN : It's the place where we can find the code of differents commands which are used by the botw
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;


    if(client.commands.has(commandName)){
        client.commands.get(commandName).run(client, interaction).catch(console.error);
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith('accept-rules')) {
            const customId = interaction.customId;
            const roleId = customId.split('-')[2];
            const role = interaction.member.guild.roles.cache.get(roleId);
            try{
                await interaction.member.roles.add(role);
            }
            catch (error){
                console.error("Erreur lors de l'ajout du rôle", error);
            }
            
            let e1 = new EmbedBuilder()
                .setDescription(`Vous avez accepté les règles et obtenu le rôle ${role} !`)
            await interaction.reply({ embeds: [e1], ephemeral: true })
        }
    }
})

// FR : Dès que le bot rejoint un serveur, on crée la base de données
// EN : When the bot joins a server, we create the database
client.on('guildCreate', guild => {
    createDatabase(guild.id);
});

// FR : Connexion à Discord grâce au token de notre client
// EN : Login to Discord with your client's token
client.login(token);