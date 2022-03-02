const Discord = require('discord.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const path = require('path');
const User = require(path.join(__dirname, '../models/user.js')); 
const Cookie = require(path.join(__dirname, '../models/cookie.js'));

module.exports = {
    name: 'cut',
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        user = await User.user.find({ userId: message.author.id }, { crystals: 1, pulls: 1 })
        .catch(err => {
            console.log(err);
        });
        //check for sufficient crystals
        if (user[0].crystals < 300){
            let embed = new MessageEmbed()
                .setColor('#f0ab22')
                .setTitle(`Sorry, ${message.author.username} ...`)
                .setDescription(`:gem: ${user[0].crystals} is not enough to summon`);
            message.reply({ embeds: [embed] });
        }
        else {
            await User.user.updateOne({ userId: message.author.id }, { $set: {
                crystals: user[0].crystals - 300,
                pulls: user[0].pulls + 1
            }});
            cut(message);
        }
    }
};


async function cut(message){
    var embed = new MessageEmbed(); 
    //find user
    let user = await User.user.find({ userId: message.author.id }, { cookies: 1, lastCookie: 1, lastEpic: 1, pull: 1 })
    .catch(err => {
        console.log(err);
    });
    let rng = Math.random()*100;
    let pull;
    let ss;
    //pity epic
    if (user[0].lastEpic + 100 == user[0].pull){
        ss = false;
        let c = Math.floor(Math.random()*Cookie.epic.length);
        await User.user.updateOne({ userId: message.author.id }, { $set: { lastEpic: user[0].pulls }});
        pull = await Cookie.cookie.find({ id: Cookie.epic[c] });
    }
    else{
        if (rng < rates.common){ //ss prob = 32.186
            embed.setColor('#e3b68f');
            ss = rng < 32.186; //determines whether user pulled soulstone or cookie
            let c = Math.floor(Math.random()*Cookie.common.length); //index of cookie
            pull = await Cookie.cookie.find({ id: Cookie.common[c] }); 
        }
        else if (rng < rates.rare){ //ss prob = 32.186
            embed.setColor('#279af2');
            ss = rng < 73.983;
            let c = Math.floor(Math.random()*Cookie.rare.length); //index of cookie
            pull = await Cookie.cookie.find({ id: Cookie.rare[c] });
        }
        else if (rng < rates.epic){ //ss prob = 16.419
            embed.setColor('#f53897');
            ss = rng < 95.694;
            if (!ss){
                await User.user.updateOne({ userId: message.author.id }, { $set: { lastEpic: user[0].pulls }});
            }
            let c = Math.floor(Math.random()*Cookie.epic.length); //index of cookie
            pull = await Cookie.cookie.find({ id: Cookie.epic[c] });
        }
        else if (rng < rates.legendary){ //ss prob = 0.616
            embed.setColor('#6afce6');
            ss = rng < 99.196
            let c = Math.floor(Math.random()*Cookie.legend.length); //index of cookie
            pull = await Cookie.cookie.find({ id: Cookie.legend[c] });
        }
        else if (rng < rates.ancient){ //ss prob = 0.616
            embed.setColor('#6532d1')
            ss = rng < 99.920
            let c = Math.floor(Math.random()*Cookie.ancient.length); //index of cookie
            pull = await Cookie.cookie.find({ id: Cookie.ancient[c] });
        }
        //pity cookie
        if (user[0].lastCookie + 10 == user[0].pull){
            ss = false;
        }
    }
    console.log(pull);
    let gain = 0;
    if (ss){
        let count = Math.round(Math.random()*2) + 1;
        gain = count;
        if (rng >= rates.legendary) { count = 1; }
        embed.setTitle(`${pull[0].name} Soulstone x${count}`);
        embed.setImage(pull[0].ss);
    } 
    else {
        gain = 20;
        await User.user.updateOne({ userId: message.author.id }, { $set: { lastCookie: user[0].pulls }});
        embed.setTitle(pull[0].name);
        embed.setDescription(pull[0].phrase);
        embed.setImage(pull[0].pull);
    }
    //give ss
    let list = user[0].cookies;
    console.log(pull);
    //check if user has cookie
    if (user[0].cookies.has(Cookie)){
        list.set(pull[0].id, user[0].cookies.get(pull[0].id) + gain);
    }
    else {
        list.set(pull[0].id, gain);
    }
    await User.user.updateOne({ userId: message.author.id }, { $set: { cookies: list }});
    message.reply({ embeds: [embed] });
}

const rates = {
    common: 41.797,
    rare: 79.275,
    epic: 98.580,
    legendary: 99.304,
    ancient: 100.000
};

