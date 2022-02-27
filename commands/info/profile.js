const User = require(process.env.DIR + '/models/user.js');
const Canvas = require('canvas');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'profile',
    category: 'info',
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        let user = await User.user.find({ userId: message.author.id }, { crystals: 1, pull: 1, cookies: 1 });
        let embed = new MessageEmbed()
            .setTitle(`${message.author.username}'s Kingdom`)
            .setThumbnail(message.author.avatarURL)
            .setFields({ name: 'Crystals', value: ':gem'})

    }
}

