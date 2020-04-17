const Commando = require("@iceprod/discord.js-commando");
const path = require("path");
const sqlite = require("sqlite");
const Youtube = require("@mindaugaskasp/node-youtube");
const YoutubePlayer = require("./services/player/youtube-player");
const config = require("./config.json");
const acc = require("./managers/accountManager");

const messageServices = [
    require("./services/message/links"),
    require("./services/message/invites")
];

const Snoowrap = require("snoowrap");
const redditConfig = {
    user_agent: "Ice Bot",
    client_id: config.reddit.id,
    client_secret: config.reddit.secret,
    username: config.reddit.username,
    password: config.reddit.password
};

const inhibitors = [
    require("./services/inhibitors/checkChannel")
];

const client = new Commando.Client({
    owner: ["147365975707090944", "236504705428094976"],
    commandPrefix: "ice ",
    invite: "https://iceproductions.dev"
});

require("./services/logging/registerEvents")(client);
require("./services/server")(client);

client.setProvider(
    sqlite.open(path.join(__dirname, "settings.sqlite3")).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.config = config;
client.music = new YoutubePlayer(new Youtube(config.youtube.token, config.youtube.base_url));

console.log("Loading commands...");

var loadedCommands = new Map();

client.on("commandRegister", c => {
    loadedCommands.set(c.name, c);
});

(async () => {
    try {
        const r = await new Snoowrap(redditConfig);
        // eslint-disable-next-line no-unused-expressions
        (await r.getSubreddit("announcements")).user_flair_background_color;
        console.log("Reddit connection successful");
        module.exports.reddit = r;
    } catch(e) {
        console.error(`Reddit connection not successful, error:\n${e.error.error}, ${e.error.message}`);
        if(e.error.error === 401) console.error("This probably means, that some values in your config are wrong, and therefore the bot cannot access Reddit. Please contact the original creators of this bot if you're absolutely sure that you set it up correctly.");
    }finally{
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
    }
})();

client.on("ready", () => {
    var groups = new Map();
    for(const [, command] of loadedCommands) {
        groups.set(command.group, groups.get(command.group) + 1 || 1);
    }
    groups = new Map([...groups].sort((a, b) => {
        return (a[1] > b[1] && -1) || (a[1] === b[1] ? 0 : 1);
    }));
    for(const [group, length] of groups) {
        console.log(`[load] Loaded ${length.toString().padStart(2, " ")} commands in ${group.id}`);
    }

    console.log("Ready!");
});

client.on("commandRun", (c, p, msg) => {
    console.log("[USE] [" + msg.guild.name + "] " + msg.author.tag + " -> " + msg.content);
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
