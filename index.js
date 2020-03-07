const Discord = require('discord.js');
const client = new Discord.Client();
const ascii = require("ascii-table");

const cluster = require('cluster');

if(!cluster.isMaster){
    require("./cmd/dev/eval");
    return;
}
const VERSION = "14";
var commands = null;
require("fs").watchFile(
    require("path").resolve("./commands"),
    () => {
        console.log('Reloading commands');
        delete require.cache[require.resolve("./commands")];
        commands = require("./commands");
    }
);

const PREFIX = "ice ";
 
client.on('ready', () => {
    console.log(`ICE Ready as ` + client.user.username + "#" + client.user.discriminator);

    let table = new ascii("ICE");
    table.setHeading("Statistics", "Value");
    table.addRow("Author", "Daniel Bulant");
    table.addRow("Version", VERSION);
    table.addRow("Guilds", client.guilds.size);
    console.log(table.toString());
    
    client.user.setPresence({
        game: {
            name: "ice help"
        },
        status: "online"
    });
});

global.started = new Date;
global.lastReload = new Date;

client.on('message', msg => {
    if(msg.content.trim().substr(0,PREFIX.length) != PREFIX)return;
    const fullnick = msg.author.username + "#" + msg.author.discriminator;
    
    if (msg.content == "ice reload") {
        if (msg.member.id == 147365975707090944) {
            global.lastReload = new Date;
            delete require.cache[require.resolve("./commands")];
            commands = require("./commands");
            msg.reply("Done");
            return;
        } else {
            msg.reply("You don't have permission for this.");
            return;
        }
    }
    if(true || msg.channel.type == "dm"){
        console.log("[CMD] " + fullnick + ": " + msg.content);
        commands(client, msg, PREFIX).then(async()=>{
            require("./accountManager").sendAchievmentUnique(msg, "new");
        }).catch(e=>{
            console.log(e);
            msg.channel.send("An error occured. Try again later");
        });
    }
});

client.login('NjU0NzI1NTM0MzY1OTA5MDQz.XfJuvQ.p7CsvSf0YWTOGtbPoL7Ok3xan0Y');