const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");
const got = require("got");

module.exports = class NPM extends commando.Command {
    constructor(client) {
        super(client, {
            name: "npm",
            memberName: "npm",
            group: "dev",
            description: "Gets info about NPM package",
            usage: "npm <pkg>",
            args: [
                {
                    key: "pkg",
                    type: "string",
                    prompt: "Which NPM package to get info about?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();
        got("https://api.npms.io/v2/search?q=" + cmd.pkg).then(body => {
            var json = body.body;
            var obj = JSON.parse(json);
            if(obj.total === 0) {
                msg.channel.send(lang.package.not_found.title);
                return;
            }
            var pkg = obj.results[0].package;
            var embed = newEmbed();
            embed.setTitle(pkg.name + "@" + pkg.version);
            embed.setURL(pkg.links.npm);
            embed.setDescription(pkg.description);
            if(pkg.author) { embed.addField("» " + lang.general.author, pkg.author.name, true); }
            if(pkg.publisher) { embed.addField("» " + lang.package.publisher, pkg.publisher.username, true); }
            embed.addField("» " + lang.package.maintainers, pkg.maintainers.map(e => e.username).join(", "), true);
            msg.channel.send(embed);
        });
    }
};
