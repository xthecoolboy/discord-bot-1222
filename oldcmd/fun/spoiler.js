class Invite {
    getName() {
        return "spoiler";
    }
    getAliases() {
        return ["spoil"];
    }
    getDesc() {
        return "Make the bot say something in annoying spoilers.";
    }
    exec(cmd, client, msg) {
        cmd.shift();
        if (!cmd[0]) {
            msg.channel.send("Pass some text here. (Use this command as `ice spoiler <text>`)");
            return;
        }
        var text = cmd.join(" ").split("").join("||||");
        msg.channel.send("||" + text + "||");
    }
}

module.exports = new Invite;