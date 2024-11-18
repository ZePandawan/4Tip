const fs = require("fs");

exports.run = async (client, interaction) => {
    const channel = interaction.options.getChannel("channel");
    const type = interaction.options.getString("type");
    const guildId = interaction.guildId;

    const dbFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dbFile, "utf-8"));

    /*if(!channel.isText()){
        interaction.reply("Le salon doit être un salon textuel !");
        return;
    }*/

    const channelExistIndex = data.channels.findIndex(channel => channel[type] );
    if(channelExistIndex !== -1){
        data.channels[channelExistIndex][type] = channel.id;
    }else{
        const channelData = {
            [type]: channel.id
        };
        data.channels.push(channelData);
    }

    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dbFile, updatedData);


    //console.log(channelData);
    interaction.reply(`Le salon ${channel} a bien été défini comme salon ${type} !`);

}