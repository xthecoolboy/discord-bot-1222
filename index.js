const Commando = require("@iceprod/discord.js-commando");
const { Structures } = require("discord.js");
const path = require("path");
const sqlite = require("sqlite");
const config = require("./config.json");
const acc = require("./managers/accountManager");
const Player = require("./services/player/player");

Structures.extend("Guild", (Guild) => {
    return class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.music = new Player(this);
        }
    };
});

const messageServices = [
    require("./services/message/messagePreview"),
    require("./services/message/links")
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
    invite: "<https://discord.gg/JUTFUKH>"
});

if(config.dbl) {
    const DBL = require("dblapi.js");
    const dbl = new DBL(config.dbl, client);

    // Optional events
    dbl.on("posted", () => {
        console.log("Server count posted!");
    });

    dbl.on("error", e => {
        console.log(`Oops! ${e}`);
    });
} else {
    console.log("Skipping DBL API integration as no token is present in config.");
}

require("./services/logging/registerEvents")(client);
require("./services/server")(client);

client.setProvider(
    sqlite.open(path.join(__dirname, "settings.sqlite3")).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.config = config;

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
    } finally {
        client.registry.registerGroups([
            ["special", "Special owner-only commands"],
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
    console.log("[USE] [" + (msg.guild.type === "dm" ? "DM" : msg.guild.name) + "] " + msg.author.tag + " -> " + msg.content);
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
