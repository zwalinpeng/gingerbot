const { getFiles } = require('../util/functions');
const fs = require('fs');

module.exports = (bot, reload) => {
    const {client} = bot;

    fs.readdirSync('./commands/').forEach(() => {
        let commands = getFiles(`./commands`, '.js');

        commands.forEach((f) => {
            if (reload){
                delete require.cache[require.resolve(`../commands/${f}`)];
            }
            const command = require(`../commands/${f}`);
            client.commands.set(command.name, command);
        });

    });

    console.log(`Loaded ${client.commands.size} commands`);
}