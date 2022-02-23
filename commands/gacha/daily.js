const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'daily',
    category: 'gacha',
    devOnly: false,
    permissions: [],
    run: async ({bot, message, args}) => {
        daily(message);
    }
};

function daily(message){
    //TODO: check if already logged-in
    let embed = new MessageEmbed()
        .setColor('#21a5de')
        .setTitle(message.author.username + '\'s Daily Check-in')
        .setThumbnail(message.author.avatarURL())
        .setDescription(':gem: x300 collected');
    message.reply({embeds: [embed]});
}