const fs = require("fs");
const { riotApiKey } = require("../../Config/config.json");

exports.run = async (client, interaction) => {
    // Récupération du pseudo du streamer et de l'id du serveur
    const pseudo = interaction.options.getString("pseudo");
    const tag = interaction.options.getString("tag");
    const guildId = interaction.guildId;


    // Récupération des données de la base de données du serveur
    const dbFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, "utf-8"));

    try{
        const firstLink = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(pseudo)}/${encodeURIComponent(tag)}`;
        let response = await fetch(firstLink, {
            method: 'GET',
            headers: {
                'X-Riot-Token': riotApiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données : ${response.status} ${response.statusText}`);
        }

        const dataAPI = await response.json();
        const puuid = dataAPI.puuid;

        if(!data.lolTracker){
            data.lolTracker = [];
        }

        // Vérification si le joueur est déjà dans la base de données
        const playerExist = data.lolTracker.find(player => player.puuid === puuid);
        if(playerExist){
            interaction.reply("Ce joueur est déjà dans la liste !");
            return;
        }

        // Création de l'objet playerData
        const playerData = {
            "puuid": puuid,
            "playerName": pseudo,
            "tag": tag,
            "rank": "",
            "LP": "",
            "lastGame": ""
        };

        // Ajout du joueur dans la base de données
        data.lolTracker.push(playerData);
        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(dbFile, updatedData);
        
        // Réponse au mesage de l'utilisateur
        interaction.reply(`Le joueur ${pseudo}#${tag} a bien été ajouté !`);



    }catch(err){
        console.log(err);
        interaction.reply("Une erreur est survenue !");
    }
};