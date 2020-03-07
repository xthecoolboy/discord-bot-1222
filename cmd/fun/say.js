class Invite {
    getName() {
        return "say";
    }
    getDesc() {
        return "Make me say something";
    }
    exec(cmd, client, msg) {
        cmd.shift();
        if (!cmd[0]) {
            msg.channel.send("Pass some text here. (Use this command as `ice say <text>`)");
            return;
        }
        msg.channel.send(cmd.join(" "));
    }
}

module.exports = new Invite;