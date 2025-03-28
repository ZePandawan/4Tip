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
            "regular_pokemons": [],
            "shiny_pokemons": [],
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


function AddPokemonToUser(userId, pokemonId, pokemonName, isShiny) {
    const data = JSON.parse(fs.readFileSync(pokemonFile, "utf8"));
    const userData = data.pokemon_list.find(user => user.user_id === userId);

    let pokemonList = isShiny ? userData.shiny_pokemons : userData.regular_pokemons;
    let pokemonDB = pokemonList.find(pokemon => pokemon.id === pokemonId);

    if (pokemonDB) {
        pokemonDB.quantity += 1;
    } else {
        let newPokemon = {
            "id": pokemonId,
            "name": pokemonName,
            "quantity": 1
        };
        pokemonList.push(newPokemon);
    }

    userData.last_use = new Date().getTime();
    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(pokemonFile, updatedData);
}

function getUserPokemon(userId, isShiny = false) {
    const data = JSON.parse(fs.readFileSync(pokemonFile, "utf8"));
    const pokeListKey = isShiny ? "shiny_pokemons" : "regular_pokemons";
    const userData = data.pokemon_list.find(user => user.user_id === userId);
    return userData ? userData[pokeListKey] : null;
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


function tradePokemons(user1, user2){
    const tradeFileName = `./Code/database/poketrades.json`;
    const pokemonFile = "./Code/database/list_pokemon_users.json";
    const tradeData = JSON.parse(fs.readFileSync(tradeFileName, "utf8"));
    const pokemonData = JSON.parse(fs.readFileSync(pokemonFile, "utf8"));
    const tradeInfo = tradeData.poketrades.find(trade => trade.user1 == user1 && trade.user2 == user2);
    //const pokemonUser1 = tradeInfo.pokemon1;
    //const pokemonUser2 = tradeInfo.pokemon2;

    const pokemonsUser1 = pokemonData.pokemon_list.find(user => user.user_id === user1);
    const pokemonsUser2 = pokemonData.pokemon_list.find(user => user.user_id === user2);

    const pokemonUser1 = pokemonsUser1.regular_pokemons.find(pokemon => pokemon.name == tradeInfo.pokemon1);
    const pokemonUser2 = pokemonsUser2.regular_pokemons.find(pokemon => pokemon.name == tradeInfo.pokemon2);

    // Remove pokemonUser1 from user1 and add it to user2
    if(pokemonUser1.quantity === 1){
        pokemonsUser1.regular_pokemons = pokemonsUser1.regular_pokemons.filter(pokemon => pokemon.name !== tradeInfo.pokemon1);
    }
    else{
        pokemonUser1.quantity -= 1;
    }

    const existingPokemonUser2 = pokemonsUser2.regular_pokemons.find(pokemon => pokemon.name === tradeInfo.pokemon1);
    if (existingPokemonUser2) {
        existingPokemonUser2.quantity += 1;
    } else {
        pokemonsUser2.regular_pokemons.push({ ...pokemonUser1, quantity: 1 });
    }

    //pokemonsUser2.regular_pokemons.push(pokemonUser1);
    //AddPokemonToUser(user2,pokemonUser1.id,pokemonUser1.name, false);

    // Remove pokemonUser2 from user2 and add it to user1
    if(pokemonUser2.quantity === 1){
        pokemonsUser2.regular_pokemons = pokemonsUser2.regular_pokemons.filter(pokemon => pokemon.name !== tradeInfo.pokemon2);
    }
    else{
        pokemonUser2.quantity -= 1;
    }

    const existingPokemonUser1 = pokemonsUser1.regular_pokemons.find(pokemon => pokemon.name === tradeInfo.pokemon2);
    if (existingPokemonUser1) {
        existingPokemonUser1.quantity += 1;
    } else {
        pokemonsUser1.regular_pokemons.push({ ...pokemonUser2, quantity: 1 });
    }

    //pokemonsUser1.regular_pokemons.push(pokemonUser2);
    //AddPokemonToUser(user1,pokemonUser2.id,pokemonUser2.name, false);

    // Save the updated data back to the file
    fs.writeFileSync(pokemonFile, JSON.stringify(pokemonData, null, 2), "utf8");
    console.log("Trade completed successfully.");

}



module.exports = {checkAdmin, addWarn, checkWarn,getChannelId, checkOrAddUserInPokemonDB, checkTimestampPokemon, APIRequest, AddPokemonToUser,getUserPokemon, createDatabase, tradePokemons};
