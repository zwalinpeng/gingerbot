const Discord = require('discord.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const ck = require(process.env.dir + '/cookies.js');
const fs = require('fs');

module.exports = {
    name: 'cut',
    category: 'gacha',
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        cut(message)
    }
};


function cut(message){
    const embed = new MessageEmbed();
    let rng = Math.random()*100;//Math.random()*100;
    let cookie;
    let ss;
    if (rng < rates.common){ //ss prob = 32.186
        embed.setColor('#e3b68f');
        ss = rng < 32.186; //determines whether user pulled soulstone or cookie
        let c = Math.round(Math.random()*(ck.common.length - 1)); //index of cookie
        cookie = ck.common[c]; 
    }
    else if (rng < rates.rare){ //ss prob = 32.186
        embed.setColor('#279af2');
        ss = rng < 73.983;
        let c = Math.round(Math.random()*(ck.rare.length - 1)); //index of cookie
        cookie = ck.rare[c];
    }
    else if (rng < rates.epic){ //ss prob = 16.419
        embed.setColor('#f53897');
        ss = rng < 95.694;
        let c = Math.round(Math.random()*(ck.epic.length - 1)); //index of cookie
        cookie = ck.epic[c];
    }
    else if (rng < rates.legendary){ //ss prob = 0.616
        embed.setColor('#6afce6');
        ss = rng < 99.196
        let c = Math.round(Math.random()*(ck.legend.length - 1)); //index of cookie
        cookie = ck.legend[c];
    }
    else if (rng < rates.ancient){ //ss prob = 0.616
        embed.setColor('#6532d1')
        ss = rng < 99.920
        let c = Math.round(Math.random()*(ck.ancient.length - 1)); //index of cookie
        cookie = ck.ancient[c];
    }

    if (ss){
        let count = Math.round(Math.random()*2) + 1;
        if (rng >= rates.legendary) { count = 1; }
        embed.setTitle(`${cookie.name} Soulstone x${count}`);
        embed.setImage(cookie.ss);
    } 
    else {
        embed.setTitle(`${cookie.name}`);
        embed.setDescription(cookie.phrase);
        embed.setImage(cookie.pull);
    }
    message.reply({ embeds: [embed] });
}

const rates = {
    common: 41.797,
    rare: 79.275,
    epic: 98.580,
    legendary: 99.304,
    ancient: 100.000
};

