const { SlashCommandBuilder , Routes, PermissionFlagsBits  } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientId,  guildId, token } = require('../Config/config.json');

const commands = [
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
    
    new SlashCommandBuilder().setName('pokemon')
        .setDescription('Attrapez les tous !')
    ,

    new SlashCommandBuilder().setName('poke-inventory')
        .setDescription('Regarde ton inventaire !')
        .addNumberOption(option =>
            option.setName('page')
                .setDescription('Page de l\'inventaire à afficher'))                
    ,

    new SlashCommandBuilder().setName('add-streamer')
        .setDescription('Ajouter un streamer à la liste des streamers à suivre')
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Pseudo du streamer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,

    new SlashCommandBuilder().setName('remove-streamer')
        .setDescription('Supprime un streamer de la liste des streamers à suivre')
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Pseudo du streamer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,

    new SlashCommandBuilder().setName('list-streamer')
        .setDescription('Affiche la liste des streamers à suivre')
    ,

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
                    { name: 'xp', value: 'xp' }
                )
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Salon à définir')
                .setRequired(true))
        //.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,

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
    
    new SlashCommandBuilder().setName('create-rules')
        .setDescription('Créer les règles du serveur')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rôle à donner pour accepter les règles')
                .setRequired(true))
]
    .map(command => command.toJSON());

const rest = new REST({ version: "10"}).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body : commands})
    .then((data) => console.log(`Succesfully registered ${data.length} application commands. `))
    .catch(console.error);