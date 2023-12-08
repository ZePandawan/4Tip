const {checkAdmin, addWarn} = require("../corbeille/functions");




exports.run = async (client, interaction) => {
    let isUserAdmin = checkAdmin(client, interaction);
    // isUserAdmin = true --> admin
    // isUserAdmin = false --> pas admin
    // isUserAdmin ? addWarn(69,22,"Horrible","87654321","42","54") : await interaction.reply("Vous n'avez pas le bon rôle");

    console.log(interaction.user.id);


    //isUserAdmin ? addWarn(interaction.guildId, interaction.user)
};