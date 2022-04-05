const Discord = require('discord.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const path = require('path');
const User = require(path.join(__dirname, '../models/user.js')); 
const Cookie = require(path.join(__dirname, '../models/cookie.js'));
const Canvas = require('canvas');
const { listenerCount } = require('process');
const { isDataView } = require('util/types');

module.exports = {
    name: 'cut',
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        let count = 1; 
        //check args
        if (args.length >= 1){
            if (parseInt(args[0]) == NaN || args.length > 1){
                message.reply('Please enter a valid command');
                return;
            }
            count = parseInt(args[0]);
            if (count <= 0){
                message.reply('lolz :zany_face:')
                return;
            }
        }
        //get user info
        let user = await User.user.find({ userId: message.author.id }, { crystals: 1, pulls: 1, lastCookie: 1, lastEpic: 1 })
        .catch(err => {
            console.log(err);
        });
        //check for sufficient crystals
        if (user[0].crystals < 300*count){
            let embed = new MessageEmbed()
                .setColor('#f0ab22')
                .setTitle(`Sorry, ${message.author.username} ...`)
                .setDescription(`:gem: ${user[0].crystals} is not enough to summon ${count} times`);
            message.reply({ embeds: [embed] });
            return;
        }
        //start summon
        else {
            let pity = {
                pull: user[0].pulls,
                cookie: user[0].lastCookie,
                epic: user[0].lastEpic
            }
            await cut(message, count, pity);
        }
    }
};

//TODO: finish skip option
//TODO: add quit option
//returns true for next, false for skip
async function cut(message, count, pity, reply, results){
    if (count == 0){
        console.log("done!");
        await reply.reactions.removeAll();
        reply.edit({ embeds: [displayResults(results)] });
        return;
    }
    //pull
    pity.pull++;
    let summon = await getCookie((pity.cookie + 10 == pity.pull), (pity.epic + 100 == pity.pull));
    await updateInv(message.author.id, summon);
    pity = await updatePity(summon, pity, message.author.id);
    //display result
    let embed = getEmbed(summon.cookie, summon.count);
    if (reply === undefined){ //make new reply
        reply = await message.reply({ embeds: [embed], fetchReply: true });
    }
    else { //edit reply
        reply.edit({ embeds: [embed] });
    }
    //no reaction if single pull
    if (count == 1 && results === undefined){
        console.log("bye");
        return;
    }
    //make results array if undefined
    if (results === undefined){
        results = new Array(summon);
    }
    else {
        results.push(summon);
    }
    await reply.reactions.removeAll();
    await reply.react('➡️');
    //await reply.react('⏭️');
    //wait for user reaction
    const filter = (reaction, user) => {
        return ['➡️', '⏭️'].includes(reaction.emoji.name) && user.id === message.author.id;
    }
     reply.awaitReactions({filter, max: 1, time: 30000, errors: ['time']})
        .then(collected => {
            let reaction = collected.first().emoji.name;
            if (reaction === '➡️'){
                console.log('next!');
                cut(message, count - 1, pity, reply, results);
            }
        })
        .catch(collected => {
            message.reply('Session timed out... showing results');

        }); 
}

//adds summon to user data
async function updateInv(userId, summon){
    let user = await User.user.find({ userId: userId }, { cookies: 1 });
    let inv = user[0].cookies;
    let arr;
    if (summon.cookie.rarity == 1) { arr = inv.common; }
    else if (summon.cookie.rarity == 2) { arr = inv.rare; }
    else if (summon.cookie.rarity == 3) { arr = inv.epic; }
    else if (summon.cookie.rarity == 4) { arr = inv.legend; }
    else if (summon.cookie.rarity == 5) { arr = inv.ancient; }
    let found = false;
    for (let i = 0; i < arr.length; i++){
        if (arr[i].id === summon.cookie.id){
            console.log("hi");
            arr[i].ss += summon.count;
            found = true;
            break;
        }
    }
    if (!found){
        console.log(typeof arr);
        arr.push({ id: summon.cookie.id, ss: summon.count });
    }
    console.log(arr);
    arr.sort((a, b) => (a.ss > b.ss) ? 1 : (a.ss === b.ss) ? ((a.id > b.id) ? 1 : -1) : -1);
    console.log(arr);
    inv.size++;
    await User.user.updateOne({ userId: userId }, { $set: { cookies: inv }});
}

//updates reply with next pull
async function nextCookie(pity, reply){
    //get summon
    let summon = await getCookie((pity.cookie + 10 == pity.pull), (pity.epic + 100 == pity.pull));
    pity = await updatePity(summon, pity, reply.mentions.repliedUser.id);
    //display result
    let embed = getEmbed(summon.cookie, summon.count);
    reply.edit({ embeds: [embed] });
}

//updates user pity
async function updatePity(summon, pity, userId){
    //update pity
    if (summon.count == 20){
        pity.cookie = pity.pull;
        if (summon.cookie.rarity == 3){
            pity.epic = pity.pull;
        }
    }
    //update user data
    await User.user.updateOne({ userId: userId }, { $set: {
        pulls: pity.pull,
        lastCookie: pity.cookie,
        lastEpic: pity.epic
    }, $inc: {
        crystals: -300
    }});
    return pity;
}

//returns Object { cookie: Object, count: Number }
async function getCookie(cookiePity, epicPity){
    let pull = {
        count: 0 //20 for cookie
    };
    let id;
    //pity epic
    if (epicPity){
        let c = Math.floor(Math.random()*Cookie.epic.length);
        id = Cookie.epic[c];
        pull.count = 20;
        return pull;
    }
    else{
        //pity cookie
        let rng = Math.random()*100;
        if (rng < rates.common){ //ss prob = 32.186
            let c = Math.floor(Math.random()*Cookie.common.length); //index of cookie
            pull.count = rng < 32.186? Math.round(Math.random()*2) + 1 : 20; //determines whether user pulled soulstone or cookie
            id = Cookie.common[c]; 
        }
        else if (rng < rates.rare){ //ss prob = 32.186
            let c = Math.floor(Math.random()*Cookie.rare.length); //index of cookie
            pull.count = rng < 73.983? Math.round(Math.random()*2) + 1 : 20;
            id = Cookie.rare[c];
        }
        else if (rng < rates.epic){ //ss prob = 16.419
            let c = Math.floor(Math.random()*Cookie.epic.length); //index of cookie
            pull.count = rng < 95.694? Math.round(Math.random()*2) + 1 : 20;
            id = Cookie.epic[c];
        }
        else if (rng < rates.legendary){ //ss prob = 0.616
            let c = Math.floor(Math.random()*Cookie.legend.length); //index of cookie
            pull.count = rng < 99.196? 1 : 20;
            id = Cookie.legend[c];
        }
        else if (rng < rates.ancient){ //ss prob = 0.616
            let c = Math.floor(Math.random()*Cookie.ancient.length); //index of cookie
            pull.count = rng < 99.920? 1 : 20;
            id = Cookie.ancient[c];
        }
        if (cookiePity){
            pull.count = 20;
        }
    }
    let query = await Cookie.cookie.find({ id: id });
    pull.cookie = query[0];
    return pull;
}

//takes cookie: Object and count: Number
function getEmbed(cookie, count){ 
    const embed = new MessageEmbed();
    let image;
    if (count == 20){
        embed.setImage(cookie.pull);
        embed.setTitle(cookie.name);
        embed.setDescription(cookie.phrase);
    }
    else {
        embed.setImage(cookie.ss);
        embed.setTitle(`${cookie.name} Soulstone x${count}`);
    }
    //set embed color according to rarity
    if (cookie.rarity == 1) { embed.setColor('#e3b68f'); }
    else if (cookie.rarity == 2) { embed.setColor('#279af2'); }
    else if (cookie.rarity == 3) { embed.setColor('#f53897'); }
    else if (cookie.rarity == 4) { embed.setColor('#6afce6'); }
    else if (cookie.rarity == 5) { embed.setColor('#6532d1'); }
    return embed;
}

//TODO: display summon results
//takes array of objects { count: Number, cookie: Object }
function displayResults(results){
    let canvas = Canvas.createCanvas(800, 150*Math.ceil(results.size/5) + 50);
    let ctx = canvas.getContext('2d');
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#ffffff';
    return new MessageEmbed().setTitle("your results here");
}

const rates = {
    common: 41.797,
    rare: 79.275,
    epic: 98.580,
    legendary: 99.304,
    ancient: 100.000
};

