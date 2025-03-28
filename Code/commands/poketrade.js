const fs = require("fs");
const { getUserPokemon, APIRequest } = require("../functions");
const { time } = require("console");
const { ActionRowBuilder, ButtonBuilder} = require('discord.js');


exports.run = async (client, interaction) => {
    const firstDresseur = interaction.user;
    const secondDresseur = interaction.options.getMentionable('dresseur');
    const pokemon = interaction.options.getString('pokemon');
    const guildId = interaction.guildId;

    if(firstDresseur.id == secondDresseur.id){
        await interaction.reply("Vous ne pouvez pas échanger avec vous même !");
        return;
    }

    const dbFile = `./Code/database/poketrades.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

    // Vérifier si il y a déjà un échange en cours avec un des utilisateurs
    const trade = data.poketrades.find(trade =>
        (trade.user1 === firstDresseur.id && trade.user2 === secondDresseur.id) ||
        (trade.user1 === secondDresseur.id && trade.user2 === firstDresseur.id)
    );

    if (trade) {
        // Si un échange est en cours et que le pokemon2 est null, cela signifie que c'est au tour du second dresseur de choisir
        if (!trade.pokemon2) {
            const sourcePokeList = getUserPokemon(firstDresseur.id);
            const doesUserHasPokemon = sourcePokeList.find(p => p.name === pokemon);

            if (doesUserHasPokemon) {
                // Mettre à jour la base de données avec le Pokémon du second dresseur
                trade.pokemon2 = pokemon;
                fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

                const pokeTradeEmbed = {
                    color: 0x0099ff,
                    title: 'POKETRADE',
                    fields: [
                        {
                            name: `Échange Prêt !`,
                            //value: `<@${secondDresseur.id}> a échangé ${trade.pokemon1} contre ${pokemon} de <@${firstDresseur.id}>.`,
                            value: `<@${trade.user1}> acceptez vous d'échanger votre ${trade.pokemon1} contre le ${trade.pokemon2} de <@${trade.user2}> ?`,   
                        }
                    ],
                    timestamp: new Date(),
                };

                const customIdAccept = `trade-accept-${trade.user1}-${trade.user2}`;
                const customIdRefuse = `trade-refuse-${trade.user1}-${trade.user2}`;
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(customIdAccept)
                        .setLabel('Accepter')
                        .setStyle(3),
                    )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(customIdRefuse)
                        .setLabel('Refuser')
                        .setStyle(4),
                );
                await interaction.reply({ embeds: [pokeTradeEmbed], components: [row] });

            } else {
                await interaction.reply("Vous ne possédez pas ce Pokémon. N'essayez pas de tricher :angry:");
            }
        } else {
            await interaction.reply("Un échange est déjà en cours avec cet utilisateur.");
        }
    } else {
        // Initialiser la section poketrades si elle n'existe pas
        if (!data.poketrades) {
            data.poketrades = [];
        }

        
        const sourcePokeList = getUserPokemon(firstDresseur.id);
        const doesUserHasPokemon = sourcePokeList.find(p => p.name === pokemon);
        
        if (doesUserHasPokemon) {
            // Ajouter l'échange à la base de données
            data.poketrades.push({
                user1: firstDresseur.id,
                user2: secondDresseur.id,
                pokemon1: pokemon,
                pokemon2: null,
                timestamp: Date.now()
            });
    
            // Sauvegarder la base de données
            fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
            
            const pokeTradeEmbed = {
                color: 0x0099ff,
                title: 'POKETRADE',
                fields: [
                    {
                        name: `Vous allez échanger ${pokemon}.`,
                        value: `<@${secondDresseur.id}> veuillez utiliser la commande /poke-trade pour accepter l'échange et choisir votre pokémon.`,
                    }
                ],
                timestamp: new Date(),
            };
            await interaction.reply({ embeds: [pokeTradeEmbed] });
        } else {
            await interaction.reply("Vous ne possédez pas ce Pokémon. N'essayez pas de tricher :angry:");
        }
    }
};
