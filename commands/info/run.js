const { MessageEmbed } = require('discord.js');
const User = require(process.env.DIR + '/user.js');

module.exports = {
    name: 'run',
    category: 'info',
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        start(message);
    }
}

async function start(message){
    //TODO: create start message, init user, start w/ 3000 crystals, check if user already has data
    let embed = new MessageEmbed().setColor('#f0ab22');
    var user;
    try{
        user = await User.find({ userId: `${message.author.id}`});
        console.log(user);
    } catch (e) {
        console.log(e);
    }
    if (user.length == 0){ //TODO: check if user exists in db
        try {
            let user = await User.create({
                userId: `${message.author.id}`,
                pulls: 0,
                lastCookie: 0,
                lastEpic: 0,
                daily: false,
                crystals: 3000
            });
            await user.save();
            console.log(`${message.author.username} data created`);
        } catch (err) {
            console.log(err);
        }
         embed.setTitle(`Welcome ${message.author.username}!`)
         .setDescription('You got :gem: x3000! Use `!cut` or `!cut10` to summon your first cookie!');
         message.reply({embeds: [embed]});
    }
    else if (user.length == 1){
         embed.setTitle(`Welcome back ${message.author.username}!`)
         .setDescription('Your kingdom already exists!');
         message.reply({embeds: [embed]});
    }
}