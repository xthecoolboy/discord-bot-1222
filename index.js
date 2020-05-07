const Commando = require("@iceprod/discord.js-commando");
const { Structures } = require("discord.js");
const path = require("path");
const sl = require("singleline");
const sqlite = require("sqlite");
const config = require("./config.json");
const acc = require("./managers/accountManager");
const Player = require("./services/player/player");
const Snoowrap = require("snoowrap");

console.log("[LANG] Loading....");
const lang = require("./translation/translation")();
console.log("[LANG] Loaded");

var dbl;

Structures.extend("Guild", (Guild) => {
    return class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.music = new Player(this);
        }

        /**
         * @returns {object} language object
         */
        async lang() {
            var lan = await this.settings.get("lang", "en");
            return lang.get(lan).lang;
        }
    };
});

Structures.extend("User", (User) => {
    return class DBLUser extends User {
        async hasVoted() {
            if(!dbl) return true;
            return await dbl.hasVoted(this.id);
        }
    };
});

const messageServices = [
    require("./services/message/messagePreview"),
    require("./services/message/links")
];

const inhibitors = [
    require("./services/inhibitors/checkChannel")
];

const client = new Commando.Client({
    owner: ["147365975707090944", "236504705428094976"],
    commandPrefix: "aztec ",
    invite: "<https://discord.gg/8fqEepV>",
    presence: {
        activity: {
            name: "merged with Ice"
        }
    }
});

if(config.dbl) {
    const DBL = require("dblapi.js");
    dbl = new DBL(config.dbl, client);

    // Optional events
    dbl.on("posted", () => {
        console.log("[DBL] Updated count!");
    });

    dbl.on("error", e => {
        console.log(`[DBL] Error: ${e}`);
    });
} else {
    console.log("[DBL] Skipping DBL API integration as no token is present in config.\nAll users will seem to have voted on the bot (even if in fact didn't).");
}

require("./services/logging/registerEvents")(client);
require("./services/server")(client);

client.setProvider(
    sqlite.open(path.join(__dirname, "settings.sqlite3")).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.config = config;

var loadedCommands = new Map();

client.on("commandRegister", c => {
    loadedCommands.set(c.name, c);
});

(async () => {
    try {
        if(!config.reddit) {
            throw new Error("Reddit configuration is missing");
        }
        const redditConfig = {
            user_agent: "Ice Bot",
            client_id: config.reddit.id,
            client_secret: config.reddit.secret,
            username: config.reddit.username,
            password: config.reddit.password
        };

        const r = await new Snoowrap(redditConfig);
        // eslint-disable-next-line no-unused-expressions
        (await r.getSubreddit("announcements")).user_flair_background_color;
        console.log("[REDDIT] Reddit connection successful");
        module.exports.reddit = r;
    } catch(e) {
        console.error(`[REDDIT] Reddit connection not successful, error:\n${e.error.error}, ${e.error.message}`);
        if(e.error.error === 401) {
            console.error(sl(`[REDDIT]
                This probably means, that some values in your config are wrong, and therefore the bot cannot access Reddit.
                Please contact the original creators of this bot if you're absolutely sure that you set it up correctly.
            `));
        }
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
        console.log(`[LOAD] Found ${length.toString().padStart(2, " ")} commands in ${group.id}`);
    }

    console.log("[EVENT] Ready!");
});

client.on("commandRun", (c, p, msg) => {
    console.log("[USE] [" + (msg.channel.type === "dm" ? "DM" : msg.guild.name) + "] " + msg.author.tag + " -> " + msg.content);
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

process.on("unhandledRejection", e => console.error("[REJECTION]", e));
