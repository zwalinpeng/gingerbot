const { MessageEmbed } = require('discord.js');
const User = require(process.env.DIR + '/models/user.js');

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
    let embed = new MessageEmbed()
        .setColor('#f0ab22')
        .setThumbnail(message.author.avatarURL());
    var user = await User.findUser(message.author.id)
        .catch(err => {
            console.log(err);
        });
    if (user === null){
        try {
            let user = await User.user.create({
                userId: `${message.author.id}`,
                crystals: 3000,
                pulls: 0,
                lastCookie: 0,
                lastEpic: 0,
                steak: 0,
                daily: undefined,
                cookies: new Map()
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