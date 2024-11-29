const fs = require("fs");

exports.run = async (client, interaction) => {
    const channel = interaction.options.getChannel("channel");
    const type = interaction.options.getString("type");
    const guildId = interaction.guildId;

    const dbFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, "utf-8"));

    // Vérifiez si un objet dans "channels" existe déjà
    let channelsData = data.channels[0];

    if (!channelsData) {
        // Si aucun objet, créez-en un nouveau
        channelsData = {};
        data.channels = [channelsData];
    }

    // Ajoutez ou mettez à jour le type de channel dans l'objet existant
    channelsData[type] = channel.id;

    // Écrivez les modifications dans le fichier
    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dbFile, updatedData);

    interaction.reply(`Le salon ${channel} a bien été défini comme salon ${type} !`);
};
