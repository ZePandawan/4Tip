const fs = require('fs');
const { riotApiKey  } = require("../Config/config.json");

// Fonction pour vérifier les nouveaux matchs
async function checkNewGame(client) {
  const Guilds = client.guilds.cache.map(guild => guild.id);
  for (const guild of Guilds) {
      const fileName = `./Code/database/${guild}.json`;
      let data;

      try {
          data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
      } catch (error) {
          console.error(`Erreur de lecture du fichier ${fileName}:`, error);
          continue;
      }

      if (!data.channels || !data.channels[0] || !data.channels[0].lolTracker) {
          continue;
      }

      const listPlayers = checkPlayerForThisGuild(guild);
      if (!listPlayers || listPlayers.length === 0) {
          continue;
      }

      let hasChanges = false; // Permet de vérifier si on doit écrire dans le fichier

      for (const player of listPlayers) {
          const matchInfo = await checkPlayerLastMatch(player);
          if (matchInfo === 0) continue;

          const playerData = matchInfo.info.participants.find(
              participant => participant.puuid === player.puuid
          );

          const championName = playerData.championName;
          const username = player.playerName;
          const tag = player.tag;
          const matchId = matchInfo.metadata.matchId;

          const latestVersionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
          const versions = await latestVersionResponse.json();
          const latestVersion = versions[0];

          const championIconUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championName}.png`;

          const { win, kills, deaths, assists, totalMinionsKilled, neutralMinionsKilled } = playerData;

          let gameMode;
          switch(matchInfo.info.gameMode){
            case "CLASSIC":
              if(matchInfo.info.queueId == "420"){
                gameMode = "Solo/Duo";
                break;
              }
              if(matchInfo.info.queueId == "440"){
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

          const embed = {
              color: win ? 0x00ff00 : 0xff0000,
              title: `Nouveau Match ${matchId} de ${username}#${tag}`,
              description: "*Pour plus d'informations, exécutez la commande `/lol-match-details`*",
              fields: [
                  { name: 'Mode de jeu', value: gameMode, inline: true },
                  { name: 'Champion', value: championName, inline: true },
                  { name: 'KDA', value: `${kills}/${deaths}/${assists}`, inline: true },
                  { name: 'CS', value: totalMinionsKilled + neutralMinionsKilled, inline: true },
                  { name: 'Victoire', value: win ? 'Oui' : 'Non', inline: true },
              ],
              thumbnail: { url: championIconUrl },
              timestamp: new Date(matchInfo.info.gameCreation),
              footer: { text: "Données fournies par l'API Riot Games" },
          };

          await sendNotification(client, embed, guild, playerData, matchId);

          // Mise à jour des données en mémoire
          const rankedStats = await getRankedStats(playerData.summonerId);
          if (rankedStats) {
              const playerIndex = data.lolTracker.findIndex(p => p.puuid === player.puuid);
              if (playerIndex !== -1) {
                  data.lolTracker[playerIndex] = {
                      ...data.lolTracker[playerIndex],
                      rank: `${rankedStats.tier} ${rankedStats.rank}`,
                      LP: rankedStats.leaguePoints,
                      lastGame: matchId,
                  };
                  hasChanges = true;
              }
          }else{
            const playerIndex = data.lolTracker.findIndex(p => p.puuid === player.puuid);
              if (playerIndex !== -1) {
                  data.lolTracker[playerIndex] = {
                      ...data.lolTracker[playerIndex],
                      lastGame: matchId,
                  };
                  hasChanges = true;
              }
          }
      }

      // Écriture unique si des changements ont été effectués
      if (hasChanges) {
          fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
      }
  }
}

// Fonction pour récupérer les stats classées
async function getRankedStats(summonerId) {
  const url = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
  const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Riot-Token': riotApiKey }
  });

  if (!response.ok) {
      console.error(`Erreur récupération des stats classées : ${response.statusText}`);
      return null;
  }

  const stats = await response.json();
  return stats.length > 0 ? stats[0] : null;
}

// Fonction qui va retourner la liste des streamers à checker pour une guilde donnée (ou 0 si aucun streamer)
function checkPlayerForThisGuild(guildId){
  const fileName = `./Code/database/${guildId}.json`;
  const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));

  const players = data.lolTracker;
  if (players.length === 0) {
      return 0;
  }
  let listPlayers = [];
  players.forEach(player => {
    listPlayers.push(player);
  });
  return listPlayers;
}

async function checkPlayerLastMatch(player){
const matchIdRequest = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${player.puuid}/ids?start=0&count=1`;
      response = await fetch(matchIdRequest, {
          method: 'GET',
          headers: {
              'X-Riot-Token': riotApiKey
          }
      });
      if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des données : ${response.status} ${response.statusText}`);
      }
      const matchIdResult = await response.json();
      
      if(matchIdResult[0] == player.lastGame){
        return 0;
      }
      
      const matchRequest = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdResult[0]}`;

      response = await fetch(matchRequest, {
        method: 'GET',
        headers: {
            'X-Riot-Token': riotApiKey
        }
      });
      if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des données : ${response.status} ${response.statusText}`);
      }
      const matchResult = await response.json();
      //console.log(matchResult);
      return matchResult;

}

async function sendNotification(client, matchEmbed, guildId, playerData, matchId) {
  try {
      const fileName = `./Code/database/${guildId}.json`;
      const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));

      const channelId = data.channels[0].lolTracker;
      const channel = client.channels.cache.get(channelId);

      if (!channel) {
          console.error(`Channel introuvable pour la guilde ${guildId}`);
          return null;
      }

      // Envoi du message dans le canal Discord
      await channel.send({ embeds: [matchEmbed] });

      // Récupération des stats classées du joueur
      const rankedStats = await getRankedStats(playerData.summonerId);

      return rankedStats; // Retourne les stats pour mise à jour dans checkNewGame

  } catch (error) {
      console.error(`Erreur dans sendNotification :`, error);
      return null;
  }
}


module.exports = { checkNewGame };
