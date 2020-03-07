class Invite {
    getName() {
        return "lenny";
    }
    getDesc() {
        return "Everyone knows what's lenny";
    }
    exec(cmd, client, msg) {
        cmd.shift();
        msg.channel.send("( ͡° ͜ʖ ͡°)");
    }
}

module.exports = new Invite;