const { time } = require("discord.js");
const { riotApiKey } = require("../../Config/config.json");

exports.run = async (client, interaction) => {
    const username = interaction.options.getString("pseudo");
    const tag = interaction.options.getString("tag");

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
        const secondLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5`;
        response = await fetch(secondLink, {
            method: 'GET',
            headers: {
                'X-Riot-Token': riotApiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données : ${response.status} ${response.statusText}`);
        }
        const matchList = await response.json();
        //console.log(matchList);
        let listEmbed = [];

        for (const match of matchList) {
            const secondLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${match}`;
            const response = await fetch(secondLink, {
                method: 'GET',
                headers: {
                    'X-Riot-Token': riotApiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des données veuillez réessayer`);
            }

            const matchData = await response.json();

            let gameMode;
            switch(matchData.info.gameMode){
                case "CLASSIC":
                if(matchData.info.queueId == "420"){
                    gameMode = "Solo/Duo";
                    break;
                }
                if(matchData.info.queueId == "440"){
                    gameMode = "Flex";
                    break;
                }
                gameMode = "Normal";
                break;
                case "ARAM":
                gameMode = "ARAM";
                break;
                case "URF":
                gameMode = "URF";
                break;
                case "ONEFORALL":
                gameMode = "One for All";
                break;
                case "NEXUSBLITZ":
                gameMode = "Nexus Blitz";
                break;
                case "TUTORIAL":
                gameMode = "Tutorial";
                break;
            }


            const playerData = matchData.info.participants.find(
                participant => participant.riotIdGameName === username && participant.riotIdTagline === tag
            );

            if (!playerData) {
                throw new Error(`Joueur ${username}#${tag} introuvable. Veuillez vérifier que le pseudo et le tag sont corrects (sensibles à la casse).`);
                continue;
            }

            const championName = playerData.championName;

                // Fetch the latest game version
            const latestVersionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
            const versions = await latestVersionResponse.json();
            const latestVersion = versions[0];

            const championIconUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championName}.png`;

            const { win, kills, deaths, assists, totalMinionsKilled, neutralMinionsKilled } = playerData;

            const embed = {
                color: win ? 0x00ff00 : 0xff0000, // Green for win, red for loss
                title: `Match ${match} de ${username}#${tag}`,
                description: "*Pour plus d'informations, exécutez la commande `/lol-match-details`*",
                fields: [
                    { name: 'Mode de jeu', value: gameMode, inline: true },
                    { name: 'Champion', value: `${championName}`, inline: true },
                    { name: 'KDA', value: `${kills}/${deaths}/${assists}`, inline: true },
                    { name: 'CS', value: totalMinionsKilled + neutralMinionsKilled , inline: true },
                    { name: 'Résultat', value: win ? ':white_check_mark:' : ':x:', inline: true },
                ],
                thumbnail: {
                    url: championIconUrl
                },
                timestamp: new Date(matchData.info.gameCreation),
                footer: {
                    text: "Données fournies par l'API Riot Games",
                },
            };

            listEmbed.push(embed);
        }

        if (listEmbed.length === 0) {
            return interaction.reply('Une erreur s\'est produite lors de la récupération des données. Veuillez vérifier que le pseudo et le tag sont corrects (sensibles à la casse).');
        }

        // Envoyer tous les embeds
        await interaction.reply({ embeds: listEmbed });


    } catch (error) {
        console.error(error);
        await interaction.reply(error.message);
    }
};