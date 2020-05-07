const commando = require("@iceprod/discord.js-commando");
const { parse } = require("node-html-parser");
const got = require("got");
const newEmbed = require("../../embed");

module.exports = class APM extends commando.Command {
    constructor(client) {
        super(client, {
            name: "apm",
            memberName: "apm",
            group: "dev",
            description: "Gets info about Atom Text Editor package",
            usage: "apm <pkg>",
            args: [
                {
                    key: "pkg",
                    type: "string",
                    prompt: "Which Atom package to get info about?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();
        try {
            await got("https://atom.io/packages/" + cmd.pkg).then(res => {
                const root = parse(res.body);
                var name = cmd.pkg;
                var url = "https://atom.io/packages/" + cmd.pkg;
                var desc = root.querySelector(".card-description").text;
                var author = root.querySelector(".author").text;
                var download = root.querySelector(".value").text;
                var soc = root.querySelector(".social-count").text;

                var embed = newEmbed();
                embed.setTitle(name);
                embed.setDescription(desc);
                embed.setURL(url);
                embed.addField(lang.general.author, author, true);
                embed.addField(lang.general.downloads, download, true);
                embed.addField(lang.package.stars, soc, true);
                msg.channel.send(embed);
            });
        } catch(error) {
            var embed = newEmbed();
            embed.setTitle(lang.package.not_found.title);
            embed.setDescription(lang.package.not_found.desc.replace("%s", cmd.pkg));
            msg.channel.send(embed);
        }
    }
};
