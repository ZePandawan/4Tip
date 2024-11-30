const { riotApiKey } = require("../../Config/config.json");
const riotApiBase = "https://euw1.api.riotgames.com/lol";

exports.run = async (client, interaction) => {
    const username = interaction.options.getString("pseudo");
    const tag = interaction.options.getString("tag");
    const type = interaction.options.getString("type");

    try {
        // Récupération du puuid du joueur
        const firstLink = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(username)}/${encodeURIComponent(tag)}`;
        let response = await fetch(firstLink, {
            method: 'GET',
            headers: {
                'X-Riot-Token': riotApiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données : ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const puuid = data.puuid;

        // Récupération de l'id du joueur
        const secondLink = `${riotApiBase}/summoner/v4/summoners/by-puuid/${puuid}`;
        response = await fetch(secondLink, {
            method: 'GET',
            headers: {
                'X-Riot-Token': riotApiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données : ${response.status} ${response.statusText}`);
        }
        const summonerData = await response.json();
        const summonerId = summonerData.id;

        // Récupération des stats du joueur
        const thirdLink = `${riotApiBase}/league/v4/entries/by-summoner/${summonerId}`;
        response = await fetch(thirdLink, {
            method: 'GET',
            headers: {
                'X-Riot-Token': riotApiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données : ${response.status} ${response.statusText}`);
        }
        const stats = await response.json();
        let EmbedStats;
        if(type === "solo"){
            EmbedStats = stats.find(queue => queue.queueType === "RANKED_SOLO_5x5");
            //await interaction.reply(`Voici les statistiques de ${summonerData.name} en solo : \nTier : ${soloStats.tier} ${soloStats.rank}\nVictoires/Défaites : ${soloStats.wins}/${soloStats.losses}\nLP : ${soloStats.leaguePoints}`);
        }
        if(type === "flex"){
            EmbedStats = stats.find(queue => queue.queueType === "RANKED_FLEX_SR");
            //await interaction.reply(`Voici les statistiques de ${summonerData.name} en flex : \nTier : ${flexStats.tier} ${flexStats.rank}\nVictoires/Défaites : ${flexStats.wins}/${flexStats.losses}\nLP : ${flexStats.leaguePoints}`);
        }


        const embed = {
            color: 0x0099ff,
            title: `Statistiques de ${username}#${tag}`,
            fields: [
                { name: 'Niveau', value: summonerData.summonerLevel.toString(), inline: true },
                { name: 'Rang', value: `${EmbedStats.tier} ${EmbedStats.rank}`, inline: true },
                { name: 'LP', value: `${EmbedStats.leaguePoints} LP`, inline: true },
                { name: 'Victoires/Défaites', value: `${EmbedStats.wins}W / ${EmbedStats.losses}L`, inline: true },
                { name: 'Winrate', value: `${((EmbedStats.wins / (EmbedStats.wins + EmbedStats.losses)) * 100).toFixed(2)}%`, inline: true },
            ],
            footer: {
                text: "Données fournies par l'API Riot Games",
            },
        };

        await interaction.reply({ embeds: [embed] });

    } catch (err) {
        console.error("Une erreur s'est produite :", err);
    }
};
