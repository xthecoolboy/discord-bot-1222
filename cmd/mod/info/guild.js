const newEmbed = require("../../embed");

module.exports = (msg, cmd) => {
    msg.channel.send(newEmbed().setTitle("To be done"));
};
