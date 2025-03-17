const { twitchClientId, twitchClientSecret  } = require("../../Config/config.json");
const { AppTokenAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");
const fs = require("fs");

exports.run = async (client, interaction) => {
    // Récupération du pseudo du streamer et de l'id du serveur
    const streamer = interaction.options.getString("pseudo");
    const guildId = interaction.guildId;


    // Récupération des données de la base de données du serveur
    const dbFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, "utf-8"));


    // Initialisation de l'API Twitch
    const authProvider = new AppTokenAuthProvider(twitchClientId, twitchClientSecret);
    const apiClient = new ApiClient({ authProvider });
    
    const regex = "^[A-Za-z0-9-_]+$";
    if(!streamer.match(regex)){
        interaction.reply("Le pseudo du streamer ne doit contenir que des lettres, des chiffres ou des tirets !");
        return;
    }



    try{
        // Recherche du streamer avec l'API Twitch
        apiClient.users.getUserByName(streamer).then( user => {
            
            // Si user = null alors le streamer n'existe pas
            if(user === null){
                interaction.reply("Ce streamer n'existe pas !");
                return;
            }
            
            // Vérification si le streamer est déjà dans la base de données
            const streamerExist = data.streamNotif.find(streamer => streamer.id === user.id);
            if(streamerExist){
                interaction.reply("Ce streamer est déjà dans la liste !");
                return;
            }
            
            // Création de l'objet streamerData
            const streamerData = {
            "id": user.id,
            "streamerName": user.displayName,
            "isStreaming": false
        };
        
        // Ajout du streamer dans la base de données
        data.streamNotif.push(streamerData);
        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(dbFile, updatedData);
        
        // Réponse au mesage de l'utilisateur
        interaction.reply(`Le streamer ${streamer} a bien été ajouté !`);
        });

    }catch(err){
        //console.log(err);
        interaction.reply("Une erreur est survenue !");
    }
};