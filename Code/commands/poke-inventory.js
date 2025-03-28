const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const paginationEmbed = require('discordjs-v14-pagination');
const { getUserPokemon } = require("../functions");

exports.run = async (client, interaction) => {
    

    const type = interaction.options.getString("type");
    const pokemonAsk = interaction.options.getString("pokemon");
    const doublons = interaction.options.getBoolean("doublons");
    const isShiny = type === "shiny";
    const pokeList = getUserPokemon(interaction.user.id, isShiny);
    const pageSize = 10;

    if (doublons) {
        const doublesList = pokeList.filter(pokemon => pokemon.quantity > 1);

        if (doublesList.length === 0) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('POKEMON 4TIP')
                        .addFields({ name: `Inventaire de ${interaction.user.displayName}`, value: `Vous n'avez pas de Pokémon en double.` })
                        .addFields({ name: "Pokedex :", value: `${pokeList.length}/1018` })
                        .setTimestamp()
                        .setFooter({ text: '4Tip' })
                ]
            });
        }

        const pages = doublesList.reduce((acc, pokemon, index) => {
            const pageIndex = Math.floor(index / pageSize);
            acc[pageIndex] = acc[pageIndex] || "";
            acc[pageIndex] += `${pokemon.name} x${pokemon.quantity}\n`;
            return acc;
        }, []);

        const embeds = pages.map((inventory, i) =>
            new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('POKEMON 4TIP')
                .setDescription(`Page ${i + 1}/${pages.length}`)
                .addFields({ name: `Inventaire de ${interaction.user.displayName}`, value: inventory })
                .addFields({ name: "Pokedex :", value: `${pokeList.length}/1018` })
                .setTimestamp()
                .setFooter({ text: '4Tip' })
        );

        const buttons = [
            new ButtonBuilder().setCustomId('first').setEmoji('⏮').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('previous').setEmoji('◀').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('next').setEmoji('▶').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('last').setEmoji('⏭').setStyle(ButtonStyle.Primary)
        ];

        return paginationEmbed(interaction, embeds, buttons, 60000, 'Page {current}/{total}');
    }

    if (pokemonAsk) {
        const pokemonResult = pokeList.find(pokemon => pokemon.name.toLowerCase() === pokemonAsk.toLowerCase());

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('POKEMON 4TIP')
                    .addFields({
                        name: `Inventaire de ${interaction.user.displayName}`,
                        value: pokemonResult
                            ? `${pokemonResult.name} x${pokemonResult.quantity}`
                            : `*Vous ne possédez pas le pokémon ${pokemonAsk}. Essayez de le capturer avec /pokemon*`
                    })
                    .addFields({ name: "Pokedex :", value: `${pokeList.length}/1018` })
                    .setTimestamp()
                    .setFooter({ text: '4Tip' })
            ]
        });
    }

    const pages = pokeList.reduce((acc, pokemon, index) => {
        const pageIndex = Math.floor(index / pageSize);
        acc[pageIndex] = acc[pageIndex] || "";
        acc[pageIndex] += `${pokemon.name} x${pokemon.quantity}\n`;
        return acc;
    }, []);

    const embeds = pages.map((inventory, i) =>
        new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('POKEMON 4TIP')
            .setDescription(`Page ${i + 1}/${pages.length}`)
            .addFields({ name: `Inventaire de ${interaction.user.displayName}`, value: inventory })
            .addFields({ name: "Pokedex :", value: `${pokeList.length}/1018` })
            .setTimestamp()
            .setFooter({ text: '4Tip' })
    );

    const buttons = [
        new ButtonBuilder().setCustomId('first').setEmoji('⏮').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('previous').setEmoji('◀').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('next').setEmoji('▶').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('last').setEmoji('⏭').setStyle(ButtonStyle.Primary)
    ];

    return paginationEmbed(interaction, embeds, buttons, 300000, 'Page {current}/{total}');
};
