const randomPuppy = require("../../managers/reddit");
const commando = require("@iceprod/discord.js-commando");

module.exports = class Puppy extends commando.Command {
    constructor(client) {
        super(client, {
            name: "puppy",
            memberName: "puppy",
            group: "essentials",
            description: "Shows random puppy image"
        });
    }

    run(msg) {
        randomPuppy().then(obj => {
            msg.channel.send({
                files: [{
                    attachment: obj.url,
                    name: "puppy.jpg"
                }]
            });
        });
    }
};
