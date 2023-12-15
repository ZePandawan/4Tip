const { SlashCommandBuilder , Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientId,  guildId, token } = require('../Config/config.json');

const commands = [
    new SlashCommandBuilder().setName('test')
        .setDescription('Only test for dev'),
    new SlashCommandBuilder().setName('warn')
        .setDescription('Admin : Mettre un avertissement à un membre')
        .addMentionableOption(option =>
            option.setName('membre')
                .setDescription('Membre à avertir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du warn')),
    new SlashCommandBuilder().setName('pokemon')
        .setDescription('Attrapez les tous !'),
    new SlashCommandBuilder().setName('poke-inventory')
        .setDescription('Regarde ton inventaire !')
        .addNumberOption(option =>
            option.setName('page')
                .setDescription('Page de l\'inventaire à afficher')),
]
    .map(command => command.toJSON());

const rest = new REST({ version: "10"}).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body : commands})
    .then((data) => console.log(`Succesfully registered ${data.length} application commands. `))
    .catch(console.error);