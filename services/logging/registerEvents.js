const log = require("./logger");

module.exports = client => {
    client.on("messageUpdate", (old, msg) => {
        if(msg.author.bot) return;
        if(msg.channel.id === "692839951611723877" && client.user.id !== "527453262639792138") return;

        log(msg, "message.edit", {
            old,
            msg
        });
    });
};
