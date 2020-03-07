const newEmbed = require("../../embed");
const account = require("../../accountManager");
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');
TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

class Info {
    getName() {
        return "mine";
    }
    getDesc() {
        return "Mines BBS. Once per 12 hours.";
    }
    /**
     * 
     * @param {Array} cmd 
     * @param {Discord.Client} client 
     * @param {Discord.Message} msg 
     */
    async exec(cmd, client, msg) {
        cmd.shift();
        try {
            var mined = await account.mine(await account.fetchUser(msg.author.id));
            if(mined){
                msg.channel.send("Successfully mined BBS! Your current balance is " + await account.getMoney(await account.fetchUser(msg.author.id)));
            } else {
                msg.channel.send("You can't mine yet.");
            }
        } catch(e){
            console.warn(e);
            msg.channel.send("An error occured during mining BBS.");
        }
    }
}

module.exports = new Info;