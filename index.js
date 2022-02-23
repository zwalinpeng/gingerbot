const Discord = require('discord.js');
require('dotenv').config();
const mongoose = require('mongoose');

const client = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES'
    ] 
});


let bot = {
    client,
    prefix: process.env.PREFIX,
    owners: [process.env.MY_ID]
};

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.loadEvents = (bot, reload) => require('./handlers/events')(bot, reload);
client.loadCommands = (bot, reload) => require('./handlers/commands')(bot, reload);

client.loadEvents(bot, false);
client.loadCommands(bot, false);

module.exports = bot;

// client.on("ready", () => {
//     console.log(`Logged in as ${client.user.tag}`)
// })

mongoose.connect('mongodb://localhost/gingerdb', () => {
    console.log('Connected to MongoDB');
}, err => console.log(err)
);

client.login(process.env.TOKEN);
