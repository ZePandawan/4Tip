// FR : Ajout de la classe discord.js dans mon répertoire + de mon token dans mon fichier config.json
// EN : Require the necessary discord.js classes
const { Client, Intents, GatewayIntentBits, Collection, MessageMentions, GuildMemberManager, EmbedBuilder, Activity, ActivityType} = require('discord.js');
const { token } = require("../Config/config.json");
const fs = require("fs");
const {checkAdmin, getChannelId} = require("./functions")


const statuses = [
    { name: "MazaStream.fr", type: ActivityType.Watching },
    { name: "Twitch ZRadio", type: ActivityType.Listening }
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
const commandFiles = fs.readdirSync('./Code/commands').filter(file => file.endsWith('.ts'));
for (const file of commandFiles) {
    let commandConfig = require(`./commands/${file}`);
    client.commands.set(file.replace('.ts', ''), commandConfig);
}

// FR : Une fois que le client est prêt, le code ci-dessous va être exécuté (une seule fois)
// EN : When the client is ready, run this code (only once)
client.once('ready',() => {

    //console.log(checkAdmin())
    //console.og(checkUser())


    const Guilds = client.guilds.cache.map(guild => guild.id);
    //const Guilds = client.guilds.cache;
    console.log(Guilds);
    console.log("Je suis prêt !");
    //client.user.setActivity('Twitch ZRadio', { type: ActivityType.Listening });
    //client.user.setPresence({ activities: [{ name: 'new test', type: ActivityType.Listening}] });


    setInterval(() => {
        let randomStatus = statuses[count_status];
        count_status === 0 ? count_status = 1 : count_status = 0;
        client.user.setActivity(randomStatus);
    }, 30000);
});


// FR : C'est ici que l'on va avoir le code des différentes commandes qui sont utilisées par le bot
// EN : It's the place where we can find the code of differents commands which are used by the botw
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    //console.log(interaction);
    console.log(interaction.guild.members.fetch());


    if(client.commands.has(commandName)){
        client.commands.get(commandName).run(client, interaction).catch(console.error);
    }
});

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


// FR : Connexion à Discord grâce au token de notre client
// EN : Login to Discord with your client's token
client.login(token);
