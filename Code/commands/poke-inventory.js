const {EmbedBuilder} = require('discord.js');

const {getUserPokemon, APIRequest} = require("../functions");

exports.run = async (client, interaction) => {
    const type = interaction.options.getString("type");
    const pokemonAsk = interaction.options.getString("pokemon");
    const isShiny = type === "shiny";
    const pokeList = getUserPokemon(interaction.user.id, isShiny);
    const page = interaction.options.getNumber("page");
    let inventory = "";
    const page_size = 10;
    const start_index = (page - 1) * page_size;
    let end_index = 0;
    pokeList.length < start_index + page_size ? end_index = pokeList.length: end_index = start_index + page_size;
    const total_pages = Math.ceil(pokeList.length / page_size);

    if(pokemonAsk){
        const pokemonResult = pokeList.find(pokemon => pokemon.name == pokemonAsk);
        if(pokemonResult){
            const pokeEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('POKEMON 4TIP')
                .addFields({name: `Inventaire de ${interaction.user.displayName}`, value: `${pokemonResult.name} x${pokemonResult.quantity}`})
                .addFields({name: "Pokedex :", value:`${pokeList.length}/1018`})
                .setTimestamp()
                .setFooter({text: '4Tip'});
            await interaction.reply({embeds: [pokeEmbed]});
        }else{
        
            const pokeEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('POKEMON 4TIP')
                .addFields({name: `Inventaire de ${interaction.user.displayName}`, value: `*Vous ne possédez pas le pokémon ${pokemonAsk} essayez de le capturer avec /pokemon*`})
                .addFields({name: "Pokedex :", value:`${pokeList.length}/1018`})
                .setTimestamp()
                .setFooter({text: '4Tip'});
            await interaction.reply({embeds: [pokeEmbed]});
        }
    
    }else{

        if (page) {
            if (page < 1 || page > total_pages) {
                await interaction.reply(`Numéro de page incorrect, il doit être compris entre 1 et ${total_pages}`);
            } else {
                for (let i = start_index; i < end_index; i++) {
                    /*const api_result = await APIRequest(`https://tyradex.vercel.app/api/v1/pokemon/${pokeList[i].id}`).then(data => {
                    return `${data.name.fr} x${pokeList[i].quantity}`;
                });*/
                inventory += `${pokeList[i].name} x${pokeList[i].quantity}\n`;
            }
            const pokeEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('POKEMON 4TIP')
                .setDescription(`Page ${page}/${total_pages}`)
                .addFields({name: `Inventaire de ${interaction.user.displayName}`, value: `${inventory}`})
                .addFields({name: "Pokedex :", value:`${pokeList.length}/1018`})
                .setTimestamp()
                .setFooter({text: '4Tip'});
                await interaction.reply({embeds: [pokeEmbed]});
            }
        } else {
            let arraySize = 0;
            pokeList.length < 10 ? arraySize = pokeList.length : arraySize = 10;
            for (let i = 0; i < arraySize; i++) {
            /*const api_result = await APIRequest(`https://tyradex.vercel.app/api/v1/pokemon/${pokeList[i].id}`).then(data => {
                return `${data.name.fr} x${pokeList[i].quantity}`;
                });*/
                inventory += `${pokeList[i].name} x${pokeList[i].quantity}\n`;
            }
            const pokeEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('POKEMON 4TIP')
            .setDescription(`Page 1/${total_pages}`)
            .addFields({name: `Inventaire de ${interaction.user.displayName}`, value: `${inventory}`})
            .addFields({name: "Pokedex :", value:`${pokeList.length}/1018`})
            .setTimestamp()
            .setFooter({text: '4Tip'});
            await interaction.reply({embeds: [pokeEmbed]});
        }
    }
    
};

