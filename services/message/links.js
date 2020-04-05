const got = require("got");
const TOKEN = require("../../config.json").virustotal;

module.exports = async (msg) => {
    if(msg.author.bot) return;
    if(!/https?:\/\/[a-z.]{3,}\.[a-z]{2,}\/[^ ]*( .*)?/i.test(msg.content)) return;

};
