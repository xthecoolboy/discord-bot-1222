const user = require("../../accountManager");

class Invite {
    getName() {
        return "achievments";
    }
    getDesc() {
        return "Lists all your achievments";
    }
    async exec(cmd, client, msg) {
        var id = await user.fetchUser(msg.author.id);
        id = id.id;

        var achievmentsAwarded = await user.achievments(id);
        achievmentsAwarded.forEach(a=>{
            msg.channel.send(user.sendAchievment(a, msg, false));
        });

        if(achievmentsAwarded.length == 0){
            msg.channel.send("You don't have any achievments... Here have one:");
        }
    }
}

module.exports = new Invite;