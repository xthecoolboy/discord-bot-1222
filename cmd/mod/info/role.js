const newEmbed = require("../../../embed");
const moment = require("moment");

module.exports = (msg, cmd) => {
    var role = cmd.pointer;
    if(role.substr(0, 3) === "<@&")role = role.substr(3, role.length - 4);
    role = msg.guild.roles.resolve(role);
    if(!role) {
        return msg.channel.send("Couldn't find role.");
    }

    var embed = newEmbed()
        .setTitle("Info about role " + role.name)
        .setColor(role.hexColor)
        .addField("Color", role.hexColor)
        .addField("ID", role.id)
        .addField("Mentionable", role.mentionable)
        .addField("Since", moment(role.createdAt).fromNow());

    msg.channel.send(embed);
};
