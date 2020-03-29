var cheerio = require("cheerio");
const commando = require("discord.js-commando");
const newEmbed = require("../../embed");
const got = require("got");

module.exports = class Xkcd extends commando.Command {
    constructor (client) {
        super(client, {
            name: "safebooru",
            memberName: "safebooru",
            group: "anime",
            description: "Random safebooru image."
        });
    }

    async run (msg) {
        got("https://safebooru.org/index.php?page=dapi&s=post&q=index&id=" + Math.floor(Math.random() * 2903000)).then(res => {
            var $ = cheerio.load(res.body, { xmlMode: true });

            var src = $("post").attr("file_url");
            console.log(src);
            var embed = newEmbed();
            embed.setTitle("Safe booru");
            embed.setImage(src);
            msg.channel.send(embed);
        });
    }
};
