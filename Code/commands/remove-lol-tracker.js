const { riotApiKey } = require("../../Config/config.json");
const fs = require("fs");


exports.run = async (client, interaction) => {
    const pseudo = interaction.options.getString("pseudo");
    const tag = interaction.options.getString("tag");
    const guildId = interaction.guildId;

    // Récupération des données de la base de données du serveur
    const dbFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, "utf-8"));

    // Vérification si le joueur est déjà dans la base de données
    const playerExist = data.lolTracker.find(player => player.playerName === pseudo && player.tag === tag);
    if(!playerExist){
        interaction.reply("Ce joueur n'est pas dans la liste !");
        return;
    }

    // Suppression du joueur dans la base de données
    const playerIndex = data.lolTracker.indexOf(playerExist);
    data.lolTracker.splice(playerIndex, 1);
    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dbFile, updatedData);
        
    // Réponse au mesage de l'utilisateur
    interaction.reply(`Le joueur ${pseudo}#${tag} a bien été supprimé !`);

};
