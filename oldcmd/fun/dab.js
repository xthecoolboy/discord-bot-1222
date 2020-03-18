class Invite {
    getName() {
        return "dab";
    }
    getDesc() {
        return "DAB";
    }
    exec(cmd, client, msg) {
        msg.reply("<o/");
    }
}

module.exports = new Invite;