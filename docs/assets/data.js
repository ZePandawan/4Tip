window.DOC = {
  groups: [
    {title:"DÉMARRER",items:[{id:"overview",label:"Vue d'ensemble",icon:"⌂"}]},
    {title:"FONCTIONNALITÉS",items:[
      {id:"admin",label:"Administration",icon:"⚙"},
      {id:"pokemon",label:"Univers Pokémon",icon:"◈"},
      {id:"twitch",label:"Suivi Twitch",icon:"◉"},
      {id:"lol",label:"League of Legends",icon:"♜"},
      {id:"automation",label:"Automatisations",icon:"↻"}
    ]},
    {title:"EXPLOITATION",items:[
      {id:"setup",label:"Installation & configuration",icon:"⌘"},
      {id:"architecture",label:"Architecture & données",icon:"▤"},
      {id:"security",label:"Sécurité & permissions",icon:"◇"}
    ]}
  ],
  commands: [
    {group:"admin",name:"/warn",desc:"Ajoute un avertissement à un membre.",access:"Administrateur",params:[
      ["membre","Mentionnable","Oui","Membre à avertir."],["raison","Texte","Non","Motif de l'avertissement."]
    ],behavior:"La commande est déclarée avec la permission Discord Administrateur. Le traitement du seuil et du stockage doit être vérifié dans le fichier de commande avant d'être décrit plus précisément."},
    {group:"admin",name:"/define-channel",desc:"Associe un type de notification à un salon Discord.",access:"Administrateur",params:[
      ["type","Choix","Oui","welcome, stream, leave, admin, xp ou lolTracker."],["channel","Salon","Oui","Salon cible."]
    ],behavior:"Enregistre la destination utilisée par les fonctionnalités qui publient des messages automatiques. La commande est réservée aux administrateurs."},
    {group:"admin",name:"/create-rules",desc:"Publie un message de règles avec attribution d'un rôle après acceptation.",access:"Administrateur",params:[
      ["role","Rôle","Oui","Rôle attribué après acceptation des règles."]
    ],behavior:"Le gestionnaire d'interactions traite le bouton d'acceptation et ajoute le rôle sélectionné au membre."},
    {group:"pokemon",name:"/pokemon",desc:"Lance une capture de Pokémon.",access:"Membre",params:[],behavior:"Le dépôt décrit un système de capture et un inventaire par utilisateur. Les probabilités, délais et règles exactes sont susceptibles d'évoluer : consulter le code de la commande pour les valeurs à jour."},
    {group:"pokemon",name:"/poke-inventory",desc:"Consulte l'inventaire Pokémon d'un utilisateur.",access:"Membre",params:[
      ["type","Choix","Oui","normal ou shiny."],["page","Nombre","Non","Page à afficher."],["pokemon","Texte","Non","Filtre sur un Pokémon précis."],["doublons","Booléen","Non","Affiche uniquement/également les doublons selon l'implémentation."]
    ],behavior:"La commande propose une navigation par page, un filtre par Pokémon et une option relative aux doublons. Le type normal ou shiny est obligatoire."},
    {group:"pokemon",name:"/poketrade",desc:"Propose un échange de Pokémon à un autre dresseur.",access:"Membre",params:[
      ["dresseur","Mentionnable","Oui","Utilisateur avec qui échanger."],["pokemon","Texte","Oui","Pokémon proposé."]
    ],behavior:"Le bot présente une demande d'échange avec des actions d'acceptation/refus. Le traitement des boutons vérifie l'utilisateur autorisé et expire les demandes anciennes."},
    {group:"twitch",name:"/add-streamer",desc:"Ajoute un streamer à la liste suivie du serveur.",access:"Administrateur",params:[
      ["pseudo","Texte","Oui","Nom du compte Twitch."]
    ],behavior:"Le suivi des streamers utilise les identifiants Twitch configurés dans le bot."},
    {group:"twitch",name:"/remove-streamer",desc:"Retire un streamer de la liste suivie.",access:"Administrateur",params:[
      ["pseudo","Texte","Oui","Nom du compte Twitch."]
    ],behavior:"La commande est réservée aux administrateurs."},
    {group:"twitch",name:"/list-streamer",desc:"Affiche les streamers suivis par le serveur.",access:"Membre",params:[],behavior:"Affiche la liste configurée pour le serveur."},
    {group:"lol",name:"/lol-stats",desc:"Affiche les statistiques classées d'un joueur League of Legends.",access:"Membre",params:[
      ["pseudo","Texte","Oui","Riot ID : nom du joueur."],["tag","Texte","Oui","Tag du Riot ID."],["type","Choix","Oui","solo (Solo/Duo) ou flex."]
    ],behavior:"La commande nécessite une clé Riot API valide. Les données disponibles dépendent des réponses de l'API Riot."},
    {group:"lol",name:"/lol-game-stats",desc:"Affiche les cinq derniers matchs d'un joueur.",access:"Membre",params:[
      ["pseudo","Texte","Oui","Riot ID : nom du joueur."],["tag","Texte","Oui","Tag du Riot ID."]
    ],behavior:"La commande nécessite une clé Riot API valide."},
    {group:"lol",name:"/add-lol-tracker",desc:"Ajoute un joueur à la liste de suivi des parties.",access:"Membre",params:[
      ["pseudo","Texte","Oui","Riot ID : nom du joueur."],["tag","Texte","Oui","Tag du Riot ID."]
    ],behavior:"Le bot vérifie périodiquement les parties des joueurs suivis et peut publier dans le salon configuré avec le type lolTracker."},
    {group:"lol",name:"/remove-lol-tracker",desc:"Retire un joueur de la liste de suivi.",access:"Membre",params:[
      ["pseudo","Texte","Oui","Riot ID : nom du joueur."],["tag","Texte","Oui","Tag du Riot ID."]
    ],behavior:"Retire le joueur de la liste suivie du serveur."}
  ]
};