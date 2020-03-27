const Commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const Youtube = require('@mindaugaskasp/node-youtube');
const YoutubePlayer = require('./services/player/youtube-player');
const config = require("./config.json");
const acc = require("./managers/accountManager");
const messageServices = [
    require("./services/message/links")
];

const inhibitors = [
    require("./services/inhibitors/checkChannel")
];

const client = new Commando.Client({
    owner: '147365975707090944',
    commandPrefix: 'ice ',
    invite: "https://discord.gg/dZtq4Qu"
});

client.on("commandRegister", c=>console.log("[CMD]", `[${c.group.id}]`, c.name));

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.config = config;
client.music = new YoutubePlayer(new Youtube(config.youtube.token, config.youtube.base_url));

client.registry.registerGroups([
    ['anime', 'Anime commands'],
    ['balance', 'Managing your balance'],
    ['dev', 'Developer commands for help with development'],
    ['essentials', 'Universal commands'],
    ['fun', 'Fun commands'],
    ['idemit', 'Commands for Idemit'],
    ['image', 'Image processing commands'],
    ['minecraft', 'Commands for Minecraft'],
    ['mod', 'Moderator commands'],
    ['music', 'Music commands'],
    ['nsfw', 'NSFW commands'],
    ['pokemon', 'For pokemon players'],
    ['tickets', 'Ticket managing'],
    ['top', 'Shows top users of bot']
])
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
        eval: false
    })
    .registerTypesIn(path.join(__dirname, "types"))
    .registerCommandsIn(path.join(__dirname, "cmd"));

client.on("ready", ()=>{
    console.log("Ready!");
});

client.on("commandRun", (c, p, msg)=>{
    console.log("[USE] " + msg.author.tag + " -> " + msg.content);
    acc.sendAchievmentUnique(msg, "new");
});

client.on("message",async msg=>{
    for(var service of messageServices){
        await service(msg);
    }
});

for(var inhibitor of inhibitors){
    client.dispatcher.addInhibitor(inhibitor);
}

client.login(config.token);

process.on('unhandledRejection', console.error);

/*
const Discord = require('discord.js');
const client = new Discord.Client();
const ascii = require("ascii-table");
const token = require("fs").readFileSync("./token.txt", "utf-8");
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

client.login(token);
*/