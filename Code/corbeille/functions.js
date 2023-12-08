const { time } = require("console");
const {PermissionsBitField} = require("discord.js");



// ID Role Coder
const ID_role = '1139102720540803152';


function checkAdmin(client, interaction){
    // Afficher la liste des roles sur le serveur
    //console.log(interaction.guild.roles.cache.map(e => e.name))
    const role = interaction.guild.roles.cache.find((r) => r.id === ID_role);
    let guild_info = interaction.guild.members.cache.filter(e => !e.user.bot).map(e => e);
    for (const member of guild_info){
        if(interaction.user.id === member.user.id){
            if(interaction.member.roles.cache.has(role.id))
            {
                return true;
            }
        }
    }
    return false;
}


const fs = require('fs');
const dataFile = "./Code/database/4Tip.json";

function addWarn(server_id, user_id, reason, timestamp, nb_warns, warner_id){
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    let newWarn = {
        "server_id": `${server_id}`,
        "user_id": `${user_id}`,
        "reason": `${reason}`,
        "timestamp": `${timestamp}`,
        "nb_warns": `${nb_warns}`,
        "warner_id": `${warner_id}`
      };
    data.warns.push(newWarn);

    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataFile, updatedData);
}

module.exports = {checkAdmin, addWarn};