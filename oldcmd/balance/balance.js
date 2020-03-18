const newEmbed = require("../../embed");
const account = require("../../accountManager");
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');
TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

class Info {
    getName() {
        return "balance";
    }
    getAliases() {
        return ['bal'];
    }
    getDesc() {
        return "Shows yours BBS balance. Already in `ice info user`.";
    }
    /**
     * 
     * @param {Array} cmd 
     * @param {Discord.Client} client 
     * @param {Discord.Message} msg 
     */
    async exec(cmd, client, msg) {
        cmd.shift();

        msg.channel.send("Your current balance is " + await account.getMoney(await account.fetchUser(msg.author.id)));
    }
}

module.exports = Info;