const { MessageEmbed } = require('discord.js');
const path = require('path');
const User = require(path.join(__dirname, '../models/user.js'));

module.exports = {
    name: 'daily',
    devOnly: false,
    permissions: [],
    run: async ({bot, message, args}) => {
        daily(message);
    }
};

async function daily(message){
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
        try {
            let u = await User.user.find({ userId: message.author.id }, { streak: 1 });
            if (!brokeStreak(logged)) { streak = u[0].streak + 1; }
            else { streak = 1 ;}
            await User.user.updateOne({ userId: message.author.id },{
                $set: { daily: new Date(), streak: streak },
                $inc: { crystals: 300 }
            });
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

//returns true if it has been more than 24 hrs since lastLog
function newDay(lastLog){
    if (lastLog === undefined){
        return true;
    }
    let hour = 1000 * 60 * 60;
    let end = Date.now() - 24*hour;
    return lastLog < end;
}

//returns true if lastLog is within 24 hrs
function brokeStreak(lastLog){
    if (lastLog === undefined){
        return true;
    }
    let hour = 1000 * 60 * 60;
    let end = lastLog + 24*hour;
    let today = new Date();
    return today > end;
}

