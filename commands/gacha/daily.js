const { MessageEmbed } = require('discord.js');
const User = require(process.env.DIR + '/models/user.js');

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
    let user = await User.findUser(message.author.id)
        .catch(err => {
            console.log(err);
        });
    if (user === null){
        message.reply('Start your kingdom with `!run` to claim daily rewards!');
    }
    else {
        var logged;
        try {
            let u = await User.user.find({ userId: message.author.id }, { daily : 1 });
            logged = u[0].daily;
        } catch (err){
            console.log(err);
        }
        if (!newDay(logged)){ //user already logged in
            let embed = new MessageEmbed()
                .setColor('#f0ab22')
                .setTitle('Stop!')
                .setDescription(`${message.author.username}... you've already signed in today`)
                .setThumbnail('https://i.imgur.com/eZMtFRA.png');
            message.reply({ embeds: [embed] });
        }
        else { //user has not logged in
            var streak = 0;
            try {
                let u = await User.user.find({ userId: message.author.id }, { crystals: 1, streak: 1 });
                var crys = u[0].crystals;
                if (nextDay(logged)) streak = u[0].streak + 1;
                await User.user.updateOne({ userId: message.author.id }, { $set: { daily: new Date(), crystals: crys + 300, streak: streak }});
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

function newDay(lastLog){
    let today = new Date();
    if (lastLog === undefined || lastLog.getFullYear() < today.getFullYear() || lastLog.getMonth() < today.getMonth()){
        return true;
    }
    else if (lastLog.getMonth() == today.getMonth() && lastLog.getDate() < today.getDate()){
        return true;
    }
    return false;
}

function nextDay(lastLog){
    let today = newDate();
    if (lastLog === undefined){
        return true;
    }
    let next = new Date(lastLog.getFullYear(), lastLog.getMonth(), lastLog.getDate() + 1);
    return (today.getFullYear() == next.getFullYear() && today.getMonth() == next.getMonth() && today.getDate() == next.getDate());
}