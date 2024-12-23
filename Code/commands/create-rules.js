const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js');

exports.run = async (client, interaction) => {
    const role = interaction.options.getRole("role");
    const channelId = interaction.channelId;

    const rulesEmbed = {
        color: 0x0099ff,
        title: 'Règles du serveur',
        fields: [
            {
                name: 'Règle 1',
                value: 'Ne pas spammer',
            },
            {
                name: 'Règle 2',
                value: 'Ne pas insulter',
            },
            {
                name: 'Règle 3',
                value: 'Ne pas partager de contenu inapproprié',
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