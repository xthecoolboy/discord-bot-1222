
const newEmbed = require("../../embed");

module.exports = msg => {
    var embed = newEmbed();
    embed.setTitle("Info");
    embed.setDescription("Gets information about specified object/user. In format `ice info <type> <arg>");
    embed.addField("`user`", "Gets info about user")
        .addField("`channel`", "Gets info about channel")
        .addField("`guild`", "Gets info about this guild. `server` possible too");
    this.msg.channel.send(embed);
};
