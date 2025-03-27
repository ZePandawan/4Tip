const {checkOrAddUserInPokemonDB, checkTimestampPokemon, APIRequest, AddPokemonToUser} = require("../functions");
const {EmbedBuilder} = require('discord.js');

exports.run = async (client, interaction) => {
    //console.log(interaction);
    //await interaction.reply(checkOrAddUserInPokemonDB("0").toString());
    const userId = interaction.user.id;
    checkOrAddUserInPokemonDB(userId);
    const {result, remainingTime} = checkTimestampPokemon(userId);
    const TsInDate = new Date(remainingTime);
    if (result) {
        let id = Math.floor(Math.random() * 1017);
        const shinyRandom = Math.floor(Math.random()*150);
        const isShiny = shinyRandom === 0;
        
        const data = APIRequest(`https://tyradex.vercel.app/api/v1/pokemon/${id}`).then(async data => {
            AddPokemonToUser(userId, data.pokedex_id, data.name.fr, isShiny);
            let pokeEmbed;

            if(isShiny){
                pokeEmbed = new EmbedBuilder()
                    .setColor(0xFDCC1C)
                    .setTitle('POKEMON 4TIP')
                    .addFields({name: `Dresseur ${interaction.user.displayName}`, value: `✨ Wow ! Tu as capturé un ${data.name.fr} avec des couleurs inhabituelles ! ✨`})
                    .setImage(`${data.sprites.shiny}`)
                    .setTimestamp()
                    .setFooter({text: '4Tip', url: 'https://github.com/ZePandawan/4Tip'});
            }else{
                pokeEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('POKEMON 4TIP')
                    .addFields({name: `Dresseur ${interaction.user.displayName}`, value: `Super ! Tu as capturé un ${data.name.fr}`})
                    .setImage(`${data.sprites.regular}`)
                    .setTimestamp()
                    .setFooter({text: '4Tip', url: 'https://github.com/ZePandawan/4Tip'});
            }
            await interaction.reply({ embeds: [pokeEmbed] });
        });
    }else{
        const pokeEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('POKEMON 4TIP')
            .addFields({name: `Dresseur ${interaction.user.displayName}`, value: `Tu ne peux pas encore capturer un pokemon ! \nTemps restant : ${TsInDate.getHours()-1}h ${TsInDate.getMinutes()}min ${TsInDate.getSeconds()}s`})
            .setTimestamp()
            .setFooter({text: '4Tip', url: 'https://github.com/ZePandawan/4Tip'});
        await interaction.reply({embeds: [pokeEmbed]});
    }
}