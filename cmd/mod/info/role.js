const newEmbed = require("../../../embed");
const moment = require("moment");

module.exports = (msg, cmd) => {
    var role = cmd.pointer;
    if(role.substr(0, 3) === "<@&")role = role.substr(3, role.length - 4);
    role = msg.guild.roles.resolve(role);
    if(!role) {
        return msg.channel.send("Couldn't find role.");
    }

    var embed = newEmbed();
    embed.setTitle("Info about role " + role.name);
    embed.setColor(role.hexColor);
    embed.addField("Color", role.hexColor);
    embed.addField("ID", role.id);
    embed.addField("Mentionable", role.mentionable);
    embed.addField("Since", moment(role.createdAt).fromNow());

    msg.channel.send(embed);
};
