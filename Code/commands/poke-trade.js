const fs = require("fs");
const {getUserPokemon, APIRequest} = require("../functions");
const {ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder , TextInputBuilder } = require('discord.js');

exports.run = async (client, interaction) => {
    const firstDresseur = interaction.user;
    const secondDresseur = interaction.options.getMentionable('dresseur');
    const guildId = interaction.guildId;
    const dbFile = `./Code/database/${guildId}.json`;
    
    
    
    
    const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    
    // Initialiser la section poketrades si elle n'existe pas
    if (!data.poketrades) {
        data.poketrades = [];
    }
    
    // Générer un nouvel ID pour l'échange
    const tradeId = Date.now().toString();
    
    // Ajouter l'échange à la base de données
    data.poketrades.push({
        trade_id: tradeId,
        channel_id: interaction.channel.id,
        user1: firstDresseur.id,
        user2: secondDresseur.id,
        pokemon1: null,
        pokemon2: null,
        status: 'in_progress'
    });
    
    // Sauvegarder la base de données
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    
    
    const modal = new ModalBuilder()
        .setCustomId(`modal_pokemon_${guildId}_${tradeId}`)
        .setTitle(`Choisissez un Pokémon à échanger`);

    const pokemonInput = new TextInputBuilder()
        .setCustomId('pokemon_name')
        .setLabel('Entrez le nom du Pokémon')
        .setStyle(1);
        //.setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(pokemonInput);

    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);
};