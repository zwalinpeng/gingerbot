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
    var user = await User.findUser(message.author.id)
        .catch(err => {
            console.log(err);
        });
    if (user === null){ //TODO: check if user exists in db
        try {
            let user = await User.user.create({
                userId: `${message.author.id}`,
                crystals: 3000,
                pulls: 0,
                lastCookie: 0,
                lastEpic: 0,
                daily: false,
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
    else {
         embed.setTitle(`Welcome back ${message.author.username}!`)
         .setDescription('Your kingdom already exists!');
         message.reply({embeds: [embed]});
    }
}