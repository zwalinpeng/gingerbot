const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
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
            { name: 'Gacha (:gem: 300 per summon)', value: '`!cut`  Summon 1 time\n' +
                '`!cut <n>`  Summon n times\n' + 
                '`!daily`  Claim free daily rewards' },
        );
        message.reply({ embeds: [embed] });
}