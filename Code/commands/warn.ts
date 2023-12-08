const {checkAdmin, addWarn, checkWarn} = require("../functions");


exports.run = async (client, interaction) => {
    const isUserAdmin = checkAdmin(client, interaction);
    const member_to_warn = interaction.options.getMentionable("membre");
    const reason = interaction.options.getString("raison");
    const nb_warn = checkWarn(member_to_warn.id) + 1;

    // isUserAdmin = true --> admin
    // isUserAdmin = false --> pas admin

    if (isUserAdmin) {
        addWarn(interaction.guildId, member_to_warn.id, reason, Date.now(), nb_warn, interaction.member.id);
        console.log(member_to_warn);
        await interaction.reply(`L'utilisateur ${member_to_warn.user.username} a été averti`);
    } else {
        await interaction.reply("Vous n'avez pas accès à cette commande");
    }
};