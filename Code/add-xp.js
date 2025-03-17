const fs = require('fs');
const cooldowns = new Map();  

function addXP(userId, guildId, client) {
    const dataFile = `./Code/database/${guildId}.json`;
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

    if (cooldowns.has(userId)) {
        const lastMessage = cooldowns.get(userId);
        if (Date.now() - lastMessage < 30000) return; // 1 minute de cooldown
    }

    cooldowns.set(userId, Date.now());

    if(data.xp === undefined){
        data.xp = [];
    }

    let user = data.xp.find(user => user.user_id === userId);
    if(!user){
        user = {
            "user_id": userId,
            "xp": 0,
            "level": 1
        };
        data.xp.push(user);
    }

    user.xp += 10;
    if(user.xp >= 100*user.level){
        user.level++;
        try{
            const channelId = data.channels[0].xp;
            if(channelId){
                const channel = client.channels.cache.get(channelId);
                channel.send(`Bravo <@${userId}> ! Tu es passé niveau ${user.level} !`);
            }
        }
        catch(e){
            console.log(e);
        }

    }

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = { addXP };