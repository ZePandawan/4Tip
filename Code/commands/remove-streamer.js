const { twitchClientId, twitchClientSecret  } = require("../../Config/config.json");
const { AppTokenAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");
const fs = require("fs");


exports.run = async (client, interaction) => {
    const streamer = interaction.options.getString("pseudo");
    const guildId = interaction.guildId;


    // Récupération des données de la base de données du serveur
    const dbFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, "utf-8"));


    // Initialisation de l'API Twitch
    const authProvider = new AppTokenAuthProvider(twitchClientId, twitchClientSecret);
    const apiClient = new ApiClient({ authProvider });

    // Recherche du streamer avec l'API Twitch
    apiClient.users.getUserByName(streamer).then( user => {

        // Si user = null alors le streamer n'existe pas
        if(user === null){
            interaction.reply("Ce streamer n'existe pas !");
            return;
        }

        // Vérification si le streamer est déjà dans la base de données
        const streamerExist = data.streamNotif.find(streamer => streamer.id === user.id);
        if(!streamerExist){
            interaction.reply("Ce streamer n'est pas dans la liste !");
            return;
        }

        // Suppression du streamer dans la base de données
        const streamerIndex = data.streamNotif.indexOf(streamerExist);
        data.streamNotif.splice(streamerIndex, 1);
        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(dbFile, updatedData);
        
        // Réponse au mesage de l'utilisateur
        interaction.reply(`Le streamer ${streamer} a bien été supprimé !`);
    });





   
};