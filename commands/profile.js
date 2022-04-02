const path = require('path');
const User = require(path.join(__dirname, '../models/user.js')); 
const Cookie = require(path.join(__dirname, '../models/cookie.js'));
const Canvas = require('canvas');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
    name: 'profile',
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        let user = await User.user.find({ userId: message.author.id }, { crystals: 1, daily: 1, pulls: 1, streak: 1, cookies: 1 });
        //check if streak was more than one day ago
        if (brokeStreak(user[0].daily)){
            await User.user.updateOne({ userId: message.author.id }, { $set: { streak: 0 }});
        }
        let embed = new MessageEmbed()
            .setTitle(`${message.author.username}'s Kingdom`)
            .setThumbnail(message.author.avatarURL())
            .setColor('#f0ab22')
            .setFields(
                { name: 'Crystals', value: `:gem: ${user[0].crystals}`, inline: true },
                { name: 'Pulls', value: `:woman_mage: ${user[0].pulls}`, inline: true },
                { name: 'Daily Streak', value: `:date: ${user[0].streak}`, inline: true });
        if (user[0].cookies.size != 0){
            const attachment = await displayCookies(user[0].cookies);
            embed.setImage('attachment://cookieList.png');
            message.reply({ embeds: [embed], files: [attachment] });
            return;
        }
        message.reply({ embeds: [embed] });
    }
};

//TODO: sort by rarity + cookie/ss ?
//create image that displays user cookies
async function displayCookies(cookies){
    //TODO: fix font
    //Canvas.registerFont(path.join(__dirname, '../cookieRun.ttf'), { family: 'sans-serif'});
    let canvas = Canvas.createCanvas(800, 150*Math.ceil(cookies.size/4) + 50);
    let ctx = canvas.getContext('2d');
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Cookies', 0, 30);
    //TODO: dx dy for images
    let col = 0;
    let row = 0;
    for (let [id, ss] of cookies){
        if (ss < 20){
            let ck = await Cookie.cookie.find({ id: id }, { ss: 1 });
            let image = await Canvas.loadImage(ck[0].ss);
            ctx.drawImage(image, 150 * col, 50 + (row*150), 150, 150);

        }
        else {
            let ck = await Cookie.cookie.find({ id: id }, { card: 1 });
            let image = await Canvas.loadImage(ck[0].card);
            ctx.drawImage(image, 150 * col, 50 + (row*150), 150, 150);
        }
        if (col == 4){
            col = 0;
            row++;
        }
        else{
            col++;
        }
    }
    let attachment = new MessageAttachment(canvas.toBuffer(), 'cookieList.png');
    return attachment;
}

//TODO: puts cookies in display order
function orderCookies(cookies){

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
