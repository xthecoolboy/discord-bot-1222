

class Pay {
    disabled = true;
    getName() {
        return "pay";
    }
    getDescription() {
        return "Pay someone BBS";
    }
    exec(cmd, client, msg) {

    }
}

module.exports = new Pay;