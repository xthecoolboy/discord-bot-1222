const Commando = require("discord.js-commando");
const path = require("path");
const sqlite = require("sqlite");
const Youtube = require("@mindaugaskasp/node-youtube");
const YoutubePlayer = require("./services/player/youtube-player");
const config = require("./config.json");
const acc = require("./managers/accountManager");
const messageServices = [
    require("./services/message/links")
];

const inhibitors = [
    require("./services/inhibitors/checkChannel")
];

const client = new Commando.Client({
    owner: "147365975707090944",
    commandPrefix: "ice ",
    invite: "https://discord.gg/JUTFUKH"
});

require("./services/logging/registerEvents")(client);
require("./services/server")(client);

client.on("commandRegister", c => {
    console.log("[CMD]", `[${c.group.id}]`, c.name);
});

client.setProvider(
    sqlite.open(path.join(__dirname, "settings.sqlite3")).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.config = config;
client.music = new YoutubePlayer(new Youtube(config.youtube.token, config.youtube.base_url));

client.registry.registerGroups([
    ["anime", "Anime commands"],
    ["balance", "Managing your balance"],
    ["dev", "Developer commands for help with development"],
    ["essentials", "Universal commands"],
    ["fun", "Fun commands"],
    ["idemit", "Commands for Idemit"],
    ["image", "Image processing commands"],
    ["minecraft", "Commands for Minecraft"],
    ["mod", "Moderator commands"],
    ["music", "Music commands"],
    ["nsfw", "NSFW commands"],
    ["pokemon", "For pokemon players"],
    ["tickets", "Ticket managing"],
    ["top", "Shows top users of bot"]
])
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
        eval: false
    })
    .registerTypesIn(path.join(__dirname, "types"))
    .registerCommandsIn(path.join(__dirname, "cmd"));

client.on("ready", () => {
    console.log("Ready!");
});

client.on("commandRun", (c, p, msg) => {
    console.log("[USE] " + msg.author.tag + " -> " + msg.content);
    acc.sendAchievmentUnique(msg, "new");
});

client.on("message", async msg => {
    for(var service of messageServices) {
        await service(msg);
    }
});

for(var inhibitor of inhibitors) {
    client.dispatcher.addInhibitor(inhibitor);
}

client.login(config.token);

process.on("unhandledRejection", console.error);
