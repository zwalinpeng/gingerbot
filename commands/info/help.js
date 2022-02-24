const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    category: 'info',
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        help(message);
    }
}

function help(message){
    const embed = new MessageEmbed()
        .setThumbnail()
        .setColor('#f0ab22')
        .setTitle('GingerBot')
        .addFields(
            { name: 'Welcome!', value: 'Use `!run` to start your kingdom!'},
            { name: 'Gacha', value: '`!cut`: Summon one time\n`!daily`: Claim daily rewards' },
        );
    
        message.reply({ embeds: [embed] });
}