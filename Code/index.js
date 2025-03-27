// FR : Ajout de la classe discord.js dans mon répertoire + de mon token dans mon fichier config.json
// EN : Require the necessary discord.js classes
const { Client, Intents, GatewayIntentBits, Collection, MessageMentions, GuildMemberManager, EmbedBuilder, Activity, ActivityType, ActionRowBuilder, ButtonBuilder} = require('discord.js');
const { token, twitchClientId, twitchClientSecret  } = require("../Config/config.json");
const fs = require("fs");
const {checkAdmin, getChannelId, createDatabase, getUserPokemon} = require("./functions");
const { checkStreamerStatus } = require('./check-streamer-status');
const { addXP } = require('./add-xp');
const { checkNewGame } = require('./lol-tracker');


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

    /*
    setInterval(() => {
        checkNewGame(client);
    }, 120000);
    */

    setInterval(() => {
        checkNewGame(client);
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
        if (interaction.customId.startsWith('poketrade')) {
            const id = interaction.customId.split("_");
            const tradeId = id[2];
            const guildId = id[3];

            if(id[1] === "accept"){
                const modal = new ModalBuilder()
                    .setCustomId(`finish_modal_pokemon_${guildId}_${tradeId}`)
                    .setTitle(`Choisissez un Pokémon à échanger`);
                
                const pokemonInput = new TextInputBuilder()
                    .setCustomId('pokemon_name')
                    .setLabel('Entrez le nom du Pokémon')
                    .setStyle(1);
                        
                
                const firstActionRow = new ActionRowBuilder().addComponents(pokemonInput);
                modal.addComponents(firstActionRow);
                await interaction.showModal(modal);

            }else{
                const dbFile = `./Code/database/${guildId}.json`;
                const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

                const dataTrade = data.poketrades.find(poketrade => poketrade.trade_id === tradeId);
                dataTrade.status = "canceled";
                fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
            }
        }

        if (interaction.customId.startsWith('finish_poketrade')) {
            const id = interaction.customId.split("_");
            const tradeId = id[3];
            const guildId = id[4];

            const dbFile = `./Code/database/${guildId}.json`;
            const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
            const dataTrade = data.poketrades.find(poketrade => poketrade.trade_id === tradeId);
            if(id[2] === "accept"){
                const user1 = dataTrade.user1;
                const user2 = dataTrade.user2;

                // Récupérer les Pokémon échangés
                const pokemon1 = dataTrade.pokemon1;
                const pokemon2 = dataTrade.pokemon2;

                // Mettre à jour les listes de Pokémon des dresseurs
                const user1PokeList = getUserPokemon(user1);
                const user2PokeList = getUserPokemon(user2);

                const quantityPoke1 = user1PokeList.find(pokemon => pokemon.name === pokemon1).quantity;
                const quantityPoke2 = user1PokeList.find(pokemon => pokemon.name === pokemon1).quantity;

                if(quantityPoke1 == 1){
                    
                }







            }else{
                const dbFile = `./Code/database/${guildId}.json`;
                const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

                const dataTrade = data.poketrades.find(poketrade => poketrade.trade_id === tradeId);
                dataTrade.status = "canceled";
                fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
            }
        }

    }

    if(interaction.isModalSubmit()){
        if(interaction.customId.startsWith('modal_pokemon')){
            const pokeName = interaction.fields.getTextInputValue('pokemon_name');
            const id = interaction.customId.split("_");
            
            const guildId = id[2];
            const tradeId = id[3];

            const dbFile = `./Code/database/${guildId}.json`;
            const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

            const dataTrade = data.poketrades.find(poketrade => poketrade.trade_id === tradeId);
            const sourceDresseur = dataTrade.user1;
            const targetDresseur = dataTrade.user2;

            const sourcePokeList = getUserPokemon(sourceDresseur);
            const doesUserHasPokemon = sourcePokeList.find(pokemon => pokemon.name === pokeName);
            console.log(doesUserHasPokemon);

            if(doesUserHasPokemon){
                const pokeTradeEmbed = {
                    color: 0x0099ff,
                    title: 'POKETRADE',
                    fields: [
                        {
                            name: `Vous allez échanger ${pokeName}.`,
                            value: `<@${targetDresseur}> acceptez-vous cet échange ?`,
                        }
                    ],
                    timestamp: new Date(),
                };

                dataTrade.pokemon1 = pokeName;
                fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

                const yes_id = `poketrade_accept_${tradeId}_${guildId}`;
                const no_id = `poketrade_refuse_${tradeId}_${guildId}`;
                const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(yes_id)
                                .setLabel('Accepter')
                                .setStyle(3))
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(no_id)
                                .setLabel('Refuser')
                                .setStyle(4),);

                interaction.reply({embeds: [pokeTradeEmbed], components: [row]});
            }else{
                interaction.reply(`Vous n'avez pas ce pokémon ! N'essayez pas de tricher :angry:`)
            }
        }

        if(interaction.customId.startsWith('finish_modal_pokemon')){
            const pokeName = interaction.fields.getTextInputValue('pokemon_name');
            const id = interaction.customId.split("_");
            
            const guildId = id[3];
            const tradeId = id[4];

            const dbFile = `./Code/database/${guildId}.json`;
            const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

            const dataTrade = data.poketrades.find(poketrade => poketrade.trade_id === tradeId);
            const sourceDresseur = dataTrade.user1;
            const targetDresseur = dataTrade.user2;

            const sourcePokeList = getUserPokemon(sourceDresseur);
            const doesUserHasPokemon = sourcePokeList.find(pokemon => pokemon.name === pokeName);
            console.log(doesUserHasPokemon);

            if(doesUserHasPokemon){
                const pokeTradeEmbed = {
                    color: 0x0099ff,
                    title: 'POKETRADE',
                    fields: [
                        {
                            name: `Vous allez échanger ${pokeName}.`,
                            value: `<@${targetDresseur}> acceptez-vous cet échange ?`,
                        }
                    ],
                    timestamp: new Date(),
                };

                dataTrade.pokemon2 = pokeName;
                fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

                const yes_id = `finish_poketrade_accept_${tradeId}_${guildId}`;
                const no_id = `finish_poketrade_refuse_${tradeId}_${guildId}`;
                const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(yes_id)
                                .setLabel('Accepter')
                                .setStyle(3))
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(no_id)
                                .setLabel('Refuser')
                                .setStyle(4),);

                interaction.reply({embeds: [pokeTradeEmbed], components: [row]});
            }else{
                interaction.reply(`Vous n'avez pas ce pokémon ! N'essayez pas de tricher :angry:`)
            }
        }
    }
});

// FR : Dès que le bot rejoint un serveur, on crée la base de données
// EN : When the bot joins a server, we create the database
client.on('guildCreate', guild => {
    createDatabase(guild.id);
});



client.on("messageCreate", async message => {
    if (message.author.bot) return;
    addXP(message.author.id, message.guild.id, client);
});

// FR : Connexion à Discord grâce au token de notre client
// EN : Login to Discord with your client's token
client.login(token);
