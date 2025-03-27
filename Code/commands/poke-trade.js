const fs = require("fs");
const {getUserPokemon, APIRequest} = require("../functions");
const {ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder , TextInputBuilder } = require('discord.js');

exports.run = async (client, interaction) => {
    const firstDresseur = interaction.user;
    const secondDresseur = interaction.options.getMentionable('dresseur');
    const guildId = interaction.guildId;

    // Récupération des données de la base de données du serveur
    const dbFile = `./Code/database/list_pokemon_users.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, "utf-8"));

    const listPokemon = getUserPokemon(firstDresseur.id);

    // Utilisation de Promise.all pour attendre toutes les requêtes API
    const userInventory = [];
    const apiRequests = listPokemon.map(async pokemon => {
        const api_result = await APIRequest(`https://tyradex.vercel.app/api/v1/pokemon/${pokemon.id}`);
        userInventory.push({ "id": pokemon.id, "name": api_result.name.fr, "quantity": pokemon.quantity });
    });

    // Attente de la fin de toutes les requêtes API
    await Promise.all(apiRequests);

    console.log(userInventory);
    /*
    const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select_pokemon')
                .setPlaceholder('Choisissez un Pokémon')
                .addOptions(userInventory.map(pokemon => ({
                    label: `Pokémon ID ${pokemon.id} : ${pokemon.name} x${pokemon.quantity}`,
                    value: `${pokemon.id}`
                })));
            
    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ content: `Choisissez un Pokémon à échanger avec ${targetUser}`, components: [row] });
    */
    const modal = new ModalBuilder()
        .setCustomId(`modal_pokemon_${interaction.channel.id}`)
        .setTitle('Choisir un Pokémon à échanger');

    const pokemonInput = new TextInputBuilder()
        .setCustomId('pokemon_name')
        .setLabel('Entrez le nom du Pokémon')
        .setStyle(1);
        //.setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(pokemonInput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
};