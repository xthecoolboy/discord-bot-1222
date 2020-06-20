const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");
const Doc = require("discord.js-docs");

module.exports = class Djs extends commando.Command {
    constructor(client) {
        super(client, {
            name: "djs",
            memberName: "djs",
            group: "dev",
            description: "Searches in discord.js docs",
            usage: "djs <query> [source]",
            args: [
                {
                    type: "string",
                    key: "query",
                    prompt: "Enter query to search for"
                },
                {
                    type: "string",
                    default: "stable",
                    key: "source",
                    prompt: "Source version to use"
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();
        this.msg = msg;
        var source = cmd.source;
        var doc;
        try {
            doc = await Doc.fetch(source);
        } catch(e) {
            return msg.channel.send("Invalid source provided. Check for typos.");
        }

        var c = cmd.query.split(".");
        var m = doc.get(...c);
        if(m) {
            return this.showDoc(m, source, lang);
        }
        this.showSearch(doc.search(c[c.length - 1]), source, c[c.length - 1], lang);
    }

    showDoc(m, source, lang) {
        var embed = newEmbed();
        embed.setTitle(m.name);
        embed.setDescription(m.description);
        embed.setURL(`https://discord.js.org/#/docs/main/${source}/class/${m.name}`);
        embed.addField(lang.docs.props, m.props.map(e => "`" + e.name + "`").join(", "));
        embed.addField(lang.docs.methods, m.methods.map(e => "`" + e.name + "`").join(", "));
        this.msg.channel.send(embed);
    }

    showSearch(d, source, q, lang) {
        var embed = newEmbed();
        embed.setTitle(lang.general.search.replace("%s", q));
        var out = "";
        d.forEach(m => {
            var url = `https://discord.js.org/#/docs/main/${source}/class/${m.name}`;
            out += "[" + m.name + "](" + url + ")\n";
        });

        embed.setDescription(out);
        this.msg.channel.send(embed);
    }
};
