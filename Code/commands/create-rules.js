const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js');

exports.run = async (client, interaction) => {
    const role = interaction.options.getRole("role");
    const channelId = interaction.channelId;

    const rulesEmbed = {
        color: 0x0099ff,
        title: '**Bienvenue sur le Discord Communautaire Officiel d’UniQ !**',
        fields: [
            {
                name: '__En rejoignant ce serveur, vous acceptez automatiquement les règles et réglementations de Twitch, Discord, Twitter, et YouTube VOD, ainsi que les Conditions Générales d’Utilisation (CGU) et de Vente (CGV) de Discord.__',
                value: 'Pour garantir une ambiance agréable pour tous, nous avons mis en place des règles simples et essentielles :',
            },
            {
                name: '**__BOT__**',
                value: 'Notre bot 4Tip, créé par notre équipe, est disponible à usage universel. Vous pouvez l’ajouter à vos propres serveurs pour profiter de ses fonctionnalités.\n-    Nous nous réservons le droit d’appliquer des mises à jour sans préavis.\n-    Les mises à jour de débogage seront considérées comme de petites mises à jour (version 1.0.0).',
            },
            {
                name: '**__Règles du Serveur Discord__**',
                value: '- Spam et flood interdits : toute tentative visant à solliciter inutilement nos modérateurs est prohibée.\n-    Les modérateurs Twitch et Discord se réservent le droit de bannir toute personne suspecte sans consulter les organisateurs, si le comportement observé est contraire aux règles.\n-    Boost et abonnements : les membres qui boostent le serveur ou s’abonnent recevront des récompenses UniQ exclusives !\n-    Ne sollicitez pas inutilement les modérateurs ou organisateurs pour des questions mineures. Si un membre vous dérange, réglez cela directement en message privé (DM).\n\nMerci de respecter ces règles pour garantir une expérience conviviale et agréable à tous. Bon séjour sur notre serveur !',
            },
        ],
        timestamp: new Date(),
    };
    const customId = `accept-rules-${role.id}`;
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(customId)
                .setLabel('Accepter les règles')
                .setStyle(3),
        );

    await interaction.reply({embeds: [rulesEmbed], components: [row]});
};