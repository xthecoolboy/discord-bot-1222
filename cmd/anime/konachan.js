var cheerio = require("cheerio");
const commando = require('discord.js-commando');
const newEmbed = require("../../embed");
const got = require("got");

module.exports = class Xkcd extends commando.Command{
    constructor(client){
        super(client, {
            name: "konachan",
            memberName: "konachan",
            group: "anime",
            description: "Random konachan image."
        })
    }

    async run(msg) {
        got("https://konachan.net/index.php?page=dapi&s=post&q=index&id=" + Math.floor(Math.random() * 2412000)).then(res => {
            var $ = cheerio.load(res.body, {xmlMode: true});
            
            var src = $("post").attr("file_url");
            console.log(src);
            var embed = newEmbed();
            embed.setTitle("Konachan");
            embed.setImage(src);
            msg.channel.send(embed);
        });
    }
}