const commando = require("discord.js-commando");
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

    getName() {
        return "djs";
    }

    getDesc() {
        return "Searches in discord.js docs";
    }

    async run(msg, cmd) {
        this.msg = msg;
        var source = cmd.source;
        const doc = await Doc.fetch(source);

        var c = cmd.query.split(".");
        var m = doc.get(...c);
        if(m) {
            return this.showDoc(m, source);
        }
        this.showSearch(doc.search(c[c.length - 1]), source, c[c.length - 1]);
    }

    showDoc(m, source) {
        var embed = newEmbed();
        embed.setTitle(m.name);
        embed.setDescription(m.description);
        embed.setURL(`https://discord.js.org/#/docs/main/${source}/class/${m.name}`);
        embed.addField("Properties", m.props.map(e => "`" + e.name + "`").join(", "));
        embed.addField("Methods", m.methods.map(e => "`" + e.name + "`").join(", "));
        this.msg.channel.send(embed);
    }

    showSearch(d, source, q) {
        var embed = newEmbed();
        embed.setTitle("Search results for *" + q + "*:");
        var out = "";
        d.forEach(m => {
            var url = `https://discord.js.org/#/docs/main/${source}/class/${m.name}`;
            out += "[" + m.name + "](" + url + ")\n";
        });

        embed.setDescription(out);
        this.msg.channel.send(embed);
    }
};
