# 4Tip Discord Bot

Un bot Discord complet et personnalisable pour la gestion de serveurs et les interactions communautaires. Développé par [@kc_pandawan](https://discord.com/users/kc_pandawan).

---

## Fonctionnalités Principales

- **Gestion des avertissements** : Commande pour donner des avertissements aux membres.
- **Système Pokemon** : Attrapez des pokémons et consultez votre inventaire.
- **Gestion des streamers** : Ajoutez, supprimez et affichez les streamers à suivre.
- **Notifications de stream** : Recevoir une notification lorsque les streamers suivis dans votre serveur sont en ligne.
- **Configuration des salons** : Définissez des salons pour différents types de messages (bienvenue, streams, etc.).
- **Statistiques League of Legends** : Consultez vos statistiques et vos derniers matchs.
- **Génération des règles** : Créez des règles pour votre serveur avec gestion des rôles.

---

## Commandes Disponibles

| Commande             | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| `/warn`              | Mettre un avertissement à un membre.                                      |
| `/pokemon`           | Attraper des Pokémons.                                                     |
| `/poke-inventory`    | Voir votre inventaire de Pokémons.                                         |
| `/add-streamer`      | Ajouter un streamer à suivre.                                            |
| `/remove-streamer`   | Supprimer un streamer de la liste.                                         |
| `/list-streamer`     | Afficher la liste des streamers à suivre.                                 |
| `/define-channel`    | Configurer les salons (bienvenue, streams, etc.).                         |
| `/lol-stats`         | Voir vos statistiques RANKED sur League of Legends.                       |
| `/lol-game-stats`    | Voir vos 5 derniers matchs sur League of Legends.                         |
| `/create-rules`      | Générer les règles de votre serveur Discord.                           |

---

## Arborescence du code 

.
├── Code/
│   ├── commands/
│   │   └── Un fichier par commande sous la forme "nom-commande.js"
│   ├── database/
│   │   ├── Une base de donnée par Serveur
│   │   └── list_pokemon_users.json
│   ├── check-streamer-status.js
│   ├── deploy-commands.js
│   ├── functions.js
│   └── index.js
├── Config/
│   └── config.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── README.md

---

## Installation

### Prérequis

- Node.js version 16.6.0 ou supérieure.
- Un bot Discord avec un token valide.
- Un compte Twitch developer pour les notifications de stream.
- Un compte RIOT GAMES developer pour les commandes sur League Of Legends *(facultatif si vous supprimez la commande correspondante dans le fichier `deploy-commands.js`et que vous supprimez le fichier correspondant à cette commande)*

### Configuration

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/ZePandawan/4Tip.git
   cd 4Tip
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez le fichier `Config/config.json` :
   ```json
   {
      "clientId": "YOUR-DISCORD-BOT-CLIENT-ID",
      "guildId": "YOUR-DISCORD-BOT-GUILD-ID",
      "token": "YOUR-DISCORD-BOT-TOKEN",
      "twitchClientId" : "YOUR-TWITCH-CLIENT-ID",
      "twitchClientSecret": "YOUR-TWITCH-CLIENT-SECRET",
      "riotApiKey":"YOUR-RIOT-API-KEY"
   }
   ```

4. Lancez le bot :
   ```bash
   node ./Code
   ```
   Ou avec pm2
   ```
   pm2 start ./Code
   ```


---

## Utilisation

Ajoutez votre bot à un serveur Discord et utilisez les commandes Slash listées ci-dessus. Assurez-vous que le bot dispose des permissions nécessaires pour exécuter les commandes.

---

## Contributions

Les contributions sont les bienvenues ! Ouvrez une issue ou soumettez une pull request pour proposer des améliorations.

---

## Auteur

- **Discord** : [@kc_pandawan](https://discord.com/users/kc_pandawan)
- **GitHub** : [Votre Profil GitHub](https://github.com/ZePandawan)

---
