const Discord = require('discord.js');
const newEmbed = require("../../embed");
const randomPuppy = require('../../reddit');

class Puppy {
    getName() {
        return "puppy";
    }
    getDesc() {
        return "Shows foto with puppy";
    }
    exec(cmd, client, msg) {
        randomPuppy().then(obj => {
            msg.channel.send({
                files: [{
                    attachment: obj.url,
                    name: "puppy.jpg"
                }]
            })
        })
    }
}

module.exports = new Puppy;