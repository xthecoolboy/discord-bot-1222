const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Format extends commando.Command {
    constructor(client) {
        super(client, {
            name: "format",
            memberName: "format",
            description: "Shows information about formatting messages",
            group: "dev"
        });
    }

    async run(msg) {
        var lang = await msg.guild.lang();
        var embed = newEmbed();

        embed.setTitle(lang.format.title);
        embed.setDescription(lang.format.desc);

        embed.addField(lang.format.bold.title, lang.format.bold.desc);

        embed.addField(lang.format.italic.title, lang.format.italic.desc);

        embed.addField(lang.format.inline.title, lang.format.inline.desc);

        embed.addField(lang.format.multiline.title, lang.format.multiline.desc);

        embed.addField(lang.format.share.title, lang.format.share.desc);

        msg.channel.send(embed);
    }
};
