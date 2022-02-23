const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'run',
    category: 'info',
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        start(message);
    }
}

function start(message){
    //TODO: create start message, init user, start w/ 3000 crystals
}