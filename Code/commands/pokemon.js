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
        //console.log(id);

        const data = APIRequest(`https://tyradex.vercel.app/api/v1/pokemon/${id}`).then(async data => {
            console.log(data);
            AddPokemonToUser(userId, data.pokedexId);

            const pokeEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('POKEMON 4TIP')
                .addFields({name: `Dresseur ${interaction.user.displayName}`, value: `Super ! Tu as capturé un ${data.name.fr}`})
                .setImage(`${data.sprites.regular}`)
                .setTimestamp()
                .setFooter({text: '4Tip', url: 'https://github.com/ZePandawan/4Tip'});

            await interaction.reply({ embeds: [pokeEmbed] });
        });
    }else{
        const pokeEmbed = new EmbedBuilder()
            .setColor(0xFF9900)
            .setTitle('POKEMON 4TIP')
            .addFields({name: `Dresseur ${interaction.user.displayName}`, value: `Tu ne peux pas encore capturer un pokemon ! \nTemps restant : ${TsInDate.getHours()-1}h ${TsInDate.getMinutes()}min ${TsInDate.getSeconds()}s`})
            .setTimestamp()
            .setFooter({text: '4Tip', url: 'https://github.com/ZePandawan/4Tip'});
        await interaction.reply({embeds: [pokeEmbed]});
    }
}