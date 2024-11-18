const fs = require("fs");

exports.run = async (client, interaction) => {
    // Récupération des options
    const channel = interaction.options.getChannel("channel");
    const type = interaction.options.getString("type");
    const guildId = interaction.guildId;

    // Ouverture de la BDD
    const dbFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, "utf-8"));

    // Vérification du type de salon
    if(channel.type !== 0){
        interaction.reply("Le salon doit être un salon textuel !");
        return;
    }

    // Vérification de l'existence du salon dans la BDD
    const channelExistIndex = data.channels.findIndex(channel => channel[type] );

    // Si le salon existe, on le met à jour, sinon on le crée
    if(channelExistIndex !== -1){
        data.channels[channelExistIndex][type] = channel.id;
    }else{
        const channelData = {
            [type]: channel.id
        };
        data.channels.push(channelData);
    }

    // Sauvegarde des données
    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dbFile, updatedData);

    interaction.reply(`Le salon ${channel} a bien été défini comme salon ${type} !`);
}