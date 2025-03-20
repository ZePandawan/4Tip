// const { time } = require("console");
// const {PermissionsBitField} = require("discord.js");



// ID Role Coder
const ID_role = '1139102720540803152';


function checkAdmin(client, interaction) {
    // Afficher la liste des roles sur le serveur
    // console.log(interaction.guild.roles.cache.map(e => e.name))
    const role = interaction.guild.roles.cache.find((r) => r.id === ID_role);
    let guild_info = interaction.guild.members.cache.filter(e => !e.user.bot).map(e => e);
    for (const member of guild_info){
        if(interaction.user.id === member.user.id){
            if(interaction.member.roles.cache.has(role.id))
            {
                return true;
            }
        }
    }
    return false;
}


const fs = require('fs');
const dataFile = "./Code/database/4Tip.json";
const pokemonFile = "./Code/database/list_pokemon_users.json";

function addWarn(guildId, user_id, reason, timestamp, nb_warns, warner_id){
    const dataFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    let newWarn = {
        "user_id": `${user_id}`,
        "reason": `${reason}`,
        "timestamp": `${timestamp}`,
        "nb_warns": `${nb_warns}`,
        "warner_id": `${warner_id}`
    };
    data.warns.push(newWarn);

    const updatedData= JSON.stringify(data, null, 2);
    fs.writeFileSync(dataFile, updatedData);
}


function checkWarn(user_id, guildId){
    let highestWarns = 0;
    const dataFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    for (let i = 0; i < data.warns.length; i++) {
        const warn = data.warns[i];

        if (warn.user_id === user_id && parseInt(warn.nb_warns) > highestWarns) {
            highestWarns = parseInt(warn.nb_warns);
        }
    }

    return highestWarns;
}

function getChannelId(channel_type, guildId) {
    let channelId = "";
    switch (channel_type) {
        case "welcome":
            const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
            const channelData = data.id_channels.find(channel => channel.guild_id === guildId);
            if (channelData) {
                channelId = channelData.welcome_id;
            }
            break;
        default:
            break;
    }
    return channelId;
}

function checkOrAddUserInPokemonDB(userId){
    const data = JSON.parse(fs.readFileSync(pokemonFile, "utf8"));
    const isUser = data.pokemon_list.find(user => user.user_id === userId);
    let result;
    //isUser ? result = true : result = false;
    if(!isUser){
        const newUser = {
            "user_id" : `${userId}`,
            "pokemons": [],
            "last_use": 0
        }
        data.pokemon_list.push(newUser);
        const updatedData= JSON.stringify(data, null, 2);
        fs.writeFileSync(pokemonFile, updatedData);
    }
}

function checkTimestampPokemon(userId){
    const data = JSON.parse(fs.readFileSync(pokemonFile, "utf8"));
    const actualTimestampInDB = data.pokemon_list.find(user => user.user_id === userId).last_use;
    const result = actualTimestampInDB <  (Date.now()- 1 * 30 * 60 * 1000);
    let remainingTime;
    if(result){
        remainingTime = 0;
    }else{
        remainingTime = 1 * 30 * 60 * 1000 - (Date.now() - actualTimestampInDB);
    }
    return {result, remainingTime};
}

function APIRequest(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur de réseau (statut ${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                // Les données sont récupérées avec succès, on les retourne
                resolve(data);
            })
            .catch(error => {
                // Gérer les erreurs de réseau ou de traitement des données
                console.error('Erreur lors de la requête API:', error.message);
                reject(error);
            });
    });
}


function AddPokemonToUser(userId, pokemonId){
    const data = JSON.parse(fs.readFileSync(pokemonFile, "utf8"));
    const userData = data.pokemon_list.find(user => user.user_id === userId);
    let pokemonDB = userData.pokemons.find(pokemon => pokemon.id === pokemonId);
    console.log(pokemonDB);
    if(pokemonDB)
    {
        pokemonDB.quantity += 1;
    }
    else{
        let newPokemon = {
            "id":pokemonId,
            "quantity": 1
        }
        userData.pokemons.push(newPokemon);
    }

    userData.last_use = new Date().getTime();
    const updatedData= JSON.stringify(data, null, 2);
    fs.writeFileSync(pokemonFile, updatedData);
}

function getUserPokemon(userId){
    const data = JSON.parse(fs.readFileSync(pokemonFile, "utf8"));
    return data.pokemon_list.find(user => user.user_id === userId).pokemons;
}

function checkDatabaseExist(guildId){
    const fileName = `./Code/database/${guildId}.json`;
    return fs.existsSync(fileName);
}

// Creation de la base de données JSON pour le serveur
function createDatabase(guildId){
    const exists = checkDatabaseExist(guildId);
    if(!exists){
        
        const data = {
            warns: [],
            channels: [],
            streamNotif: [],
            lolTracker: []
        }
        
        //Enregistrer dans un fichier JSON qui a la nom de la guilde
        const fileName = `./Code/database/${guildId}.json`;
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(fileName, jsonData);
        console.log(`Database for guild ${guildId} created`);
    }
    else{
        console.log(`Database for guild ${guildId} already exists`);
    }
}



module.exports = {checkAdmin, addWarn, checkWarn,getChannelId, checkOrAddUserInPokemonDB, checkTimestampPokemon, APIRequest, AddPokemonToUser,getUserPokemon, createDatabase};
