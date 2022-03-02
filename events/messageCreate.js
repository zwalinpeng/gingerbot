const Discord = require('discord.js');
const mongoose = require('mongoose');
const path = require('path');
const User = require(path.join(__dirname, '../models/user.js'));
 
module.exports = {
    name: 'messageCreate',
    run: async function runAll(bot, message){
        const {client, prefix, owners} = bot;

        if (!message.guild || message.author.bot) { return }

        if (!message.content.startsWith(prefix)) { return }

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmdstr = args.shift().toLowerCase();

        let command = client.commands.get(cmdstr);
        if (!command) { return }
        
        let member = message.member
        if (command.devOnly && !owners.include(member.id)){
            return message.reply('This command is only available to the bot owners');
        }

        if (command.permissions && member.permissions.missing(command.permissions).length != 0){
            return message.reply('You do not have permission to use this command');
        }

        try{
            if (command.name != 'run'){
                let user = await User.user.find({ userId: message.author.id });
                if (user.length == 0){
                    message.reply('Start your kingdom with `!run` to check your profile!');
                    return;
                }
            }   
            await command.run({...bot, message, args});
        }
        catch (err){
            let errmsg = err.toString();
            
            if (errmsg.startsWith('?')){
                errmsg = errmsg.splice(1);
                await message.reply(errmsg);
            }
            else{
                console.log(errmsg);
            }
        }

    }
}