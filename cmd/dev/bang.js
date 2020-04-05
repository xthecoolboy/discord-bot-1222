const commando = require("discord.js-commando");
const got = require("got");
const newEmbed = require("../../embed");

module.exports = class Bang extends commando.Command {
    constructor(client) {
        super(client, {
            name: "bang",
            memberName: "bang",
            aliases: ["ddg"],
            group: "dev",
            description: "Shows link to DDG bang or shows instant answer",
            args: [
                {
                    type: "string",
                    key: "string",
                    prompt: "What to try searching on DDG instant answers / bangs?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        var query = cmd.string.split(" ").join("+");

        var data = await got("https://api.duckduckgo.com/?q=" + query + "&format=json&pretty=1&no_redirect=1&no_html=1");
        var json = JSON.parse(data.body);

        if(json.Redirect) {
            // actual bang
            const embed = newEmbed();
            embed.setColor("AQUA");
            embed.setTitle("DDG Bang");
            embed.setDescription("Click the title to open the website.");
            embed.setURL(json.Redirect);
            embed.setFooter(embed.footer.text + " - Data from DuckDuckGo");
            msg.channel.send(embed);
        } else if(json.AbstractURL) {
            // Instant answer
            const embed = newEmbed();
            embed.setColor("AQUA");
            if(json.Heading) {
                embed.setTitle(json.Heading);
            } else {
                embed.setTitle("DDG Instant answer");
            }
            if(json.AbstractText) {
                embed.setDescription(json.AbstractText);
            } else {
                embed.setTitle("Click the title to open the website");
            }
            if(json.Image) embed.setImage(json.Image);
            embed.setURL(json.AbstractURL);
            embed.setFooter(embed.footer.text + " - Data from DuckDuckGo");
            msg.channel.send(embed);
        } else {
            // Nothing found/not supported
            const embed = newEmbed();
            embed.setColor("RED");
            embed.setTitle("Not found");
            embed.setDescription("Couldn't find anything on DuckDuckGo. (Note this means that DDG can have result but the bot doesn't support the type of it.");
            msg.channel.send(embed);
        }
    }
};
