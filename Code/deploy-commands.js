const { SlashCommandBuilder , Routes, PermissionFlagsBits  } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientId,  guildId, token } = require('../Config/config.json');

const commands = [
    /*###############################################################*/
    /*####################### ADMIN COMMANDS ########################*/
    /*###############################################################*/

    /** 
     * EN : warn another member
     * FR : avertissez un autre membre 
     * 
     * @param membre member to warn
     * @param raison warn cause
     */
    new SlashCommandBuilder().setName('warn')
    .setDescription('Admin : Mettre un avertissement à un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addMentionableOption(option =>
        option.setName('membre')
        .setDescription('Membre à avertir')
        .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
            .setDescription('Raison du warn'))
    ,
    
    /**
     * EN : define channels for automatic bot's message
     * FR : definit les salons pour les messages automatiques du bot
     * 
     * @param type type of channel
     * @param channel the channel
     */
    new SlashCommandBuilder().setName("define-channel")
        .setDescription('Définir les salons pour les messages du bot')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type de salon')
                .addChoices(
                    { name: 'welcome', value: 'welcome' },
                    { name: 'stream', value: 'stream' },
                    { name: 'leave', value: 'leave' },
                    { name: 'admin', value: 'admin' },
                    { name: 'xp', value: 'xp' },
                    { name: 'lolTracker', value: 'lolTracker' }
                )
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Salon à définir')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    
    /**
     * EN : create a rules message that give a role once rules accepted
     * FR : crée un message de règles qui donne un role une fois les règles acceptées
     * 
     * @param role the role to give
     */
    new SlashCommandBuilder().setName('create-rules')
        .setDescription('Créer les règles du serveur')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rôle à donner pour accepter les règles')
                .setRequired(true))
    ,

    /*###############################################################*/

    /*###############################################################*/
    /*###################### POKEMON COMMANDS #######################*/
    /*###############################################################*/

    /**
     * EN : catch a pokemon 
     * FR : capturez un pokémon
     */
    new SlashCommandBuilder().setName('pokemon')
        .setDescription('Attrapez les tous !')
    ,

    /**
     * EN : check your inventory
     * FR : regarde ton inventaire
     * 
     * @param page the page you want to see
     */
    new SlashCommandBuilder().setName('poke-inventory')
        .setDescription('Regarde ton inventaire !')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type de salon')
                .addChoices(
                    { name: 'normal', value: 'normal' },
                    { name: 'shiny', value: 'shiny' }
                )
                .setRequired(true))              
        .addNumberOption(option =>
            option.setName('page')
                .setDescription('Page de l\'inventaire à afficher'))  
    ,

    /**
     * EN : trade a pokemon with someone else
     * FR : echange un pokemon avec quelqu'un d'autre
     * 
     * @param dresseur member to trade with
     */
    new SlashCommandBuilder().setName('poke-trade')
        .setDescription('Echange un pokemon avec un autre dresseur')
        .addMentionableOption(option =>
            option.setName('dresseur')
                .setDescription('Dresseur avec qui échanger')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('pokemon')
                .setDescription('Pokemon à échanger')
                .setRequired(true))
    ,

    /*###############################################################*/

    /*###############################################################*/
    /*###################### TWITCH COMMANDS ########################*/
    /*###############################################################*/
    
    /**
     * EN : add a streamer in the tracked streamers list
     * FR : ajoute un streamer à la liste des streames traqués
     * 
     * @param pseudo username of the streamer
     */
    new SlashCommandBuilder().setName('add-streamer')
        .setDescription('Ajouter un streamer à la liste des streamers à suivre')
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Pseudo du streamer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,

    /**
     * EN : remove a streamer from the tracked streamers list
     * FR : supprime un streamer de la liste des streames traqués
     * 
     * @param pseudo username of the streamer
     */
    new SlashCommandBuilder().setName('remove-streamer')
        .setDescription('Supprime un streamer de la liste des streamers à suivre')
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Pseudo du streamer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,

    /**
     * EN : show all tracked streamer
     * FR : montre la liste des streamers traqués
     */
    new SlashCommandBuilder().setName('list-streamer')
        .setDescription('Affiche la liste des streamers à suivre')
    ,

    /*###############################################################*/

    /*###############################################################*/
    /*######################## LOL COMMANDS #########################*/
    /*###############################################################*/

    /**
     * EN : show your ranked stats in League of Legends 
     * FR : montre tes stats en classé sur League of Legends
     * 
     * @param pseudo player's username
     * @param tag player's tag
     * @param type type of ranked (SoloQ / Flex)
     */
    new SlashCommandBuilder().setName('lol-stats')
        .setDescription('Montre tes stats RANKED sur League of Legends')
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Pseudo du joueur')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Tag du joueur')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Choix entre SOLO/DUO ou FLEX')
                .addChoices(
                    { name: 'SOLO/DUO', value: 'solo' },
                    { name: 'FLEX', value: 'flex' }
                )
                .setRequired(true))
    ,

    /**
     * EN : show your 5 last games in League of Legends 
     * FR : montre tes 5 dernieres parties sur League of Legends
     * 
     * @param pseudo player's username
     * @param tag player's tag
     */
    new SlashCommandBuilder().setName('lol-game-stats')
        .setDescription('Montre tes 5 derniers matchs sur League of Legends')
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Pseudo du joueur')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Tag du joueur')
                .setRequired(true))
    ,

    /**
     * EN : add a player in the tracked players list
     * FR : ajoute un joueur à la liste des joueurs traqués
     * 
     * @param pseudo player's username
     * @param tag player's tag
     */
    new SlashCommandBuilder().setName('add-lol-tracker')
        .setDescription('Ajouter un joueur de lol à la liste des joueurs à suivre')
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Pseudo du joueur')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Tag du joueur')
                .setRequired(true))
    ,

    /**
     * EN : remove a player from the tracked players list
     * FR : supprime un joueur de la liste des joueurs traqués
     * 
     * @param pseudo player's username
     * @param tag player's tag
     */
    new SlashCommandBuilder().setName('remove-lol-tracker')
        .setDescription('Retire un joueur de lol à la liste des joueurs à suivre')
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Pseudo du joueur')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Tag du joueur')
                .setRequired(true))
    ,

    /*###############################################################*/
]
    .map(command => command.toJSON());

const rest = new REST({ version: "10"}).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body : commands})
    .then((data) => console.log(`Succesfully registered ${data.length} application commands. `))
    .catch(console.error);
