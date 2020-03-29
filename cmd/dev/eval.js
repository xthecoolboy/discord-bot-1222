const commando = require("discord.js-commando");
const {
    Worker
} = require("worker_threads");
const path = require("path");

module.exports = class Eval extends commando.Command {
    constructor (client) {
        super(client, {
            name: "jseval",
            memberName: "eval",
            group: "dev",
            description: "Runs given JS code",
            args: [{
                type: "string",
                key: "js",
                prompt: "Which JS to run?"
            }]
        });
    }

    run (msg, cmd) {
        const worker = new Worker(path.join(__dirname, "/eval/worker.js"), {
            workerData: cmd.js
        });
        var timeout = null;
        var done = false;

        worker.on("message", (message) => {
            if (message.type === "ok") {
                msg.channel.sendEmbed(message.embed);
            } else if (message.type === "error") {
                msg.channel.send("An error occured during evaluation");
            } else {
                return console.log("Doing nothing");
            }
            done = true;
            clearTimeout(timeout);
        });
        worker.on("error", e => {
            console.warn(e);
            msg.channel.send("An error occured during evaluation");
        });
        worker.on("exit", (code) => {
            done = true;
            clearTimeout(timeout);
            if (code !== 0) { msg.channel.send("An error occured during evaluation. (Exit code " + code + ")"); }
        });

        timeout = setTimeout(_ => {
            try {
                if (!done) {
                    worker.terminate();
                    console.log("Killed long taking process");
                    msg.channel.send("The code provided took too long");
                }
            } catch (e) {
            }
        }, 15000);
    }
};
