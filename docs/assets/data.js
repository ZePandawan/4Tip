window.DOC = {
  "groups": [
    {
      "title": "DÉMARRER",
      "items": [
        [
          "overview",
          "Vue d'ensemble",
          "⌂"
        ]
      ]
    },
    {
      "title": "FONCTIONNALITÉS",
      "items": [
        [
          "admin",
          "Administration",
          "⚙"
        ],
        [
          "pokemon",
          "Univers Pokémon",
          "✦"
        ],
        [
          "twitch",
          "Intégration Twitch",
          "◉"
        ],
        [
          "lol",
          "League of Legends",
          "♜"
        ],
        [
          "community",
          "XP & communauté",
          "✧"
        ],
        [
          "automation",
          "Automatisations",
          "↻"
        ]
      ]
    },
    {
      "title": "EXPLOITATION",
      "items": [
        [
          "setup",
          "Installation & configuration",
          "⌘"
        ],
        [
          "data",
          "Données & architecture",
          "▤"
        ],
        [
          "permissions",
          "Permissions & limites",
          "◇"
        ]
      ]
    }
  ],
  "commands": [
    {
      "group": "admin",
      "name": "/warn",
      "desc": "Avertit un membre ; le troisième avertissement déclenche un bannissement.",
      "access": "Administrateur",
      "params": [
        [
          "membre",
          "Mentionnable",
          "Oui",
          "Membre visé."
        ],
        [
          "raison",
          "Texte",
          "Non",
          "Motif enregistré pour les avertissements non-bloquants."
        ]
      ],
      "details": "Le code lit le nombre maximal d'avertissements déjà enregistré pour ce membre sur ce serveur, puis l'incrémente. Si le résultat atteint 3, le membre est banni et les messages des 7 derniers jours sont supprimés. Sinon, l'avertissement est ajouté au fichier JSON avec son motif, son horodatage et l'identifiant du modérateur.",
      "notes": "Point à connaître : lorsque le seuil de 3 est atteint, le code bannit directement sans enregistrer le troisième avertissement. Le motif saisi n'est pas transmis au motif du bannissement. La permission Administrateur est déclarée dans deploy-commands.js."
    },
    {
      "group": "admin",
      "name": "/define-channel",
      "desc": "Définit le salon utilisé par une fonctionnalité du bot.",
      "access": "Administrateur",
      "params": [
        [
          "type",
          "Choix",
          "Oui",
          "welcome, stream, leave, admin, xp ou lolTracker."
        ],
        [
          "channel",
          "Salon Discord",
          "Oui",
          "Salon à associer au type choisi."
        ]
      ],
      "details": "Enregistre l'identifiant du salon dans le premier objet du tableau channels du fichier JSON du serveur. Si le tableau est vide, un objet est créé. Les types stream, xp et lolTracker sont utilisés par les fonctions automatiques présentes dans le code.",
      "notes": "Les types welcome, leave et admin sont proposés dans la commande, mais leur traitement automatique n'est pas implémenté dans les fichiers examinés. Le helper getChannelId() ne lit que welcome et utilise un ancien fichier global."
    },
    {
      "group": "admin",
      "name": "/create-rules",
      "desc": "Publie un embed de règles avec un bouton d'acceptation qui attribue un rôle.",
      "access": "Administrateur",
      "params": [
        [
          "role",
          "Rôle Discord",
          "Oui",
          "Rôle attribué lorsque le membre clique sur « Accepter les règles »."
        ]
      ],
      "details": "La commande publie un embed de règles (dont le texte fait référence au Discord communautaire officiel d’UniQ) dans le salon courant. Un bouton porte un custom ID contenant l'identifiant du rôle. Le gestionnaire d'interactions ajoute ensuite ce rôle au membre et répond en message éphémère.",
      "notes": "Le rôle doit exister et le bot doit disposer de la permission de gérer les rôles ainsi que d'une position hiérarchique suffisante."
    },
    {
      "group": "pokemon",
      "name": "/pokemon",
      "desc": "Tente une capture de Pokémon aléatoire.",
      "access": "Membre",
      "params": [],
      "details": "Crée l'entrée utilisateur dans list_pokemon_users.json si nécessaire. La commande tire un identifiant aléatoire entre 0 et 1016, puis interroge Tyradex à l'adresse /api/v1/pokemon/{id}. Le Pokémon est ajouté à l'inventaire normal ou shiny.",
      "notes": "Le délai de capture est de 30 minutes. La probabilité shiny est de 1/150. Les sprites regular ou shiny de Tyradex sont affichés dans l'embed. Le cooldown est conservé dans last_use."
    },
    {
      "group": "pokemon",
      "name": "/poke-inventory",
      "desc": "Affiche l'inventaire normal ou shiny du membre qui exécute la commande.",
      "access": "Membre",
      "params": [
        [
          "type",
          "Choix",
          "Oui",
          "normal ou shiny."
        ],
        [
          "page",
          "Nombre",
          "Non",
          "Option déclarée, mais non lue dans l'implémentation actuelle."
        ],
        [
          "pokemon",
          "Texte",
          "Non",
          "Recherche un Pokémon par nom, sans tenir compte de la casse."
        ],
        [
          "doublons",
          "Booléen",
          "Non",
          "Affiche uniquement les entrées dont quantity est supérieur à 1."
        ]
      ],
      "details": "L'inventaire est chargé depuis list_pokemon_users.json. Sans filtre, les entrées sont paginées par groupes de 10 avec des boutons première/précédente/suivante/dernière. Le filtre pokemon affiche le nom et la quantité. L'option doublons filtre les quantités supérieures à 1.",
      "notes": "Le type est obligatoire. La pagination dure 5 minutes pour l'inventaire normal et 1 minute pour l'affichage des doublons. Le compteur Pokédex affiché est le nombre d'entrées de la liste sur 1018, pas le total des quantités. Le code appelle editReply() sans deferReply() visible dans cette commande : à vérifier selon le contexte d'exécution."
    },
    {
      "group": "pokemon",
      "name": "/poketrade",
      "desc": "Initie ou complète une proposition d'échange entre deux membres.",
      "access": "Membre",
      "params": [
        [
          "dresseur",
          "Mentionnable",
          "Oui",
          "L'autre membre impliqué dans l'échange."
        ],
        [
          "pokemon",
          "Texte",
          "Oui",
          "Nom exact du Pokémon proposé."
        ]
      ],
      "details": "Le premier appel crée une demande (user1, user2, pokemon1, pokemon2=null, timestamp) dans poketrades.json si l'auteur possède le Pokémon normal demandé. Le second membre doit rappeler /poketrade en ciblant l'initiateur et choisir son Pokémon. Un message avec boutons Accepter/Refuser est alors présenté ; seul user1 est autorisé à utiliser ces boutons. L'acceptation appelle tradePokemons() pour transférer un exemplaire de chaque Pokémon normal.",
      "notes": "Le texte de réponse du premier appel indique /poke-trade, mais cette commande n'existe pas dans deploy-commands.js : il faut utiliser /poketrade. Les échanges portent uniquement sur regular_pokemons, pas sur les shiny. Une demande expire après 2 minutes. Le refus et l'acceptation ne suppriment pas explicitement l'entrée ; le nettoyage périodique la supprimera à expiration."
    },
    {
      "group": "twitch",
      "name": "/add-streamer",
      "desc": "Ajoute un compte Twitch à la liste suivie du serveur.",
      "access": "Administrateur",
      "params": [
        [
          "pseudo",
          "Texte",
          "Oui",
          "Nom d'utilisateur Twitch (lettres, chiffres, tirets et tirets bas)."
        ]
      ],
      "details": "Le bot valide le format du pseudo, recherche l'utilisateur via Twurple et stocke son identifiant Twitch, son nom d'affichage et isStreaming=false dans streamNotif du JSON serveur.",
      "notes": "Nécessite twitchClientId et twitchClientSecret. Les doublons sont détectés à partir de l'identifiant Twitch."
    },
    {
      "group": "twitch",
      "name": "/remove-streamer",
      "desc": "Retire un compte Twitch de la liste suivie.",
      "access": "Administrateur",
      "params": [
        [
          "pseudo",
          "Texte",
          "Oui",
          "Nom d'utilisateur Twitch."
        ]
      ],
      "details": "Recherche le compte Twitch par pseudo, puis supprime de streamNotif l'entrée correspondant à son identifiant Twitch. Renvoie un message si le compte n'existe pas ou n'est pas suivi.",
      "notes": "Nécessite les identifiants Twitch. L'appel Twurple est asynchrone via then()."
    },
    {
      "group": "twitch",
      "name": "/list-streamer",
      "desc": "Affiche les noms des streamers enregistrés pour le serveur.",
      "access": "Membre",
      "params": [],
      "details": "Lit streamNotif dans le fichier JSON du serveur et construit un embed avec les noms d'affichage stockés.",
      "notes": "Le test d'absence de streamer compare streamers.length à une chaîne vide (\"\"), ce qui ne détecte pas correctement un tableau vide. Le message « Aucun streamer » peut donc ne pas être affiché comme prévu."
    },
    {
      "group": "lol",
      "name": "/lol-stats",
      "desc": "Affiche les statistiques classées Solo/Duo ou Flex d'un Riot ID.",
      "access": "Membre",
      "params": [
        [
          "pseudo",
          "Texte",
          "Oui",
          "Nom du Riot ID."
        ],
        [
          "tag",
          "Texte",
          "Oui",
          "Tag du Riot ID."
        ],
        [
          "type",
          "Choix",
          "Oui",
          "solo (Solo/Duo) ou flex."
        ]
      ],
      "details": "Interroge l'API Riot pour résoudre le Riot ID en PUUID, récupérer le summoner EUW puis les entrées de ligue. L'embed affiche niveau, rang, LP, victoires/défaites et winrate.",
      "notes": "Utilise riotApiKey et les routes Europe pour le compte puis EUW pour les données LoL. Les erreurs HTTP ou les identifiants incorrects produisent un message générique invitant à vérifier pseudo et tag (sensibles à la casse). Si aucune entrée de classement ne correspond au mode choisi, EmbedStats peut être undefined et déclencher cette erreur."
    },
    {
      "group": "lol",
      "name": "/lol-game-stats",
      "desc": "Affiche les cinq derniers matchs d'un Riot ID.",
      "access": "Membre",
      "params": [
        [
          "pseudo",
          "Texte",
          "Oui",
          "Nom du Riot ID."
        ],
        [
          "tag",
          "Texte",
          "Oui",
          "Tag du Riot ID."
        ]
      ],
      "details": "Résout le Riot ID en PUUID, demande les cinq derniers identifiants de match à l'API Match-V5 Europe, récupère chaque match et retrouve la participation du joueur. Chaque embed présente champion, KDA, CS, victoire/défaite et icône du champion.",
      "notes": "La recherche du joueur dans les participants compare riotIdGameName et riotIdTagline avec la casse exacte. Le texte des embeds mentionne /lol-match-details, mais cette commande n'est pas déclarée dans le dépôt."
    },
    {
      "group": "lol",
      "name": "/add-lol-tracker",
      "desc": "Ajoute un Riot ID à la liste de suivi du serveur.",
      "access": "Membre",
      "params": [
        [
          "pseudo",
          "Texte",
          "Oui",
          "Nom du Riot ID."
        ],
        [
          "tag",
          "Texte",
          "Oui",
          "Tag du Riot ID."
        ]
      ],
      "details": "Résout le Riot ID via l'API Account Europe et stocke le PUUID, pseudo, tag, rang, LP et dernier match dans lolTracker du JSON serveur. Les doublons sont détectés par PUUID.",
      "notes": "Nécessite riotApiKey. Les champs rank, LP et lastGame sont initialisés à des chaînes vides."
    },
    {
      "group": "lol",
      "name": "/remove-lol-tracker",
      "desc": "Retire un Riot ID de la liste de suivi du serveur.",
      "access": "Membre",
      "params": [
        [
          "pseudo",
          "Texte",
          "Oui",
          "Nom du Riot ID enregistré."
        ],
        [
          "tag",
          "Texte",
          "Oui",
          "Tag enregistré."
        ]
      ],
      "details": "Recherche l'entrée par correspondance exacte de playerName et tag, puis la retire de lolTracker.",
      "notes": "La commande ne résout pas de nouveau le Riot ID via l'API ; les valeurs doivent correspondre à celles enregistrées."
    }
  ],
  "pages": {
    "overview": "overview",
    "admin": "admin",
    "pokemon": "pokemon",
    "twitch": "twitch",
    "lol": "lol",
    "community": "community",
    "automation": "automation",
    "setup": "setup",
    "data": "data",
    "permissions": "permissions"
  }
};