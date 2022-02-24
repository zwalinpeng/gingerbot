const { MessageEmbed } = require('discord.js');
const User = require(process.env.DIR + '/user.js');

module.exports = {
    name: 'daily',
    category: 'gacha',
    devOnly: false,
    permissions: [],
    run: async ({bot, message, args}) => {
        daily(message);
    }
};

async function daily(message){
    //TODO: check if already logged-in
    let user = await User.findUser(message.author.id)
        .catch(err => {
            console.log(err);
        });
    if (user === null){
        message.reply('Start your kingdom with `!run` to claim daily rewards!');
    }
    else {
        var logged = false;
        try {
            let u = await User.user.find( { userId: message.author.id }, { daily : 1 } );
            logged = u[0].daily;
        } catch (err){
            console.log(err);
        }
        if (logged){ //user already logged in
            let embed = new MessageEmbed()
                .setColor('#f0ab22')
                .setTitle('Stop!')
                .setDescription(`${message.author.username}... you've already signed in today`)
                .setThumbnail('https://i.imgur.com/eZMtFRA.png');
            message.reply({ embeds: [embed] });
        }
        else { //user has not logged in
            try {
                await User.user.updateOne( { userId: message.author.id }, { $set: { daily: true }});
                //await User.user.save();
                console.log('user checked in');
            } catch (err){
                console.log(err);
            }
            let embed = new MessageEmbed()
                .setColor('#21a5de')
                .setTitle(message.author.username + '\'s Daily Check-in')
                .setThumbnail(message.author.avatarURL())
                .setDescription(':gem: x300 collected');
            message.reply({ embeds: [embed] });
        }
    }
}