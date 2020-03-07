const got = require('got');

class Joke {
    getName() {
        return "fact";
    }
    getDesc() {
        return "Shows random useless fact";
    }
    exec(cmd, client, msg) {
        got("https://uselessfacts.jsph.pl/random.json?language=en").then(response => {
            var obj = JSON.parse(response.body);
            msg.channel.send(obj.text);
        });
    }
}

module.exports = new Joke;