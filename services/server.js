const express = require("express");
const httpCodeInfo = require("../managers/httpCodeInfo");
const app = express();

var client = null;

app.get("/code/:code", (req, res) => {
    res.json(httpCodeInfo(req.params.code));
});

app.get("/stats", (req, res) => {
    res.json({
        guilds: client.guilds.length
    });
});

app.get("/guild/:id", (req, res) => {
    var guild = client.guilds.resolve(req.params.id);
    if(guild) {
        res.json(guild);
    } else {
        res.status(404).json({
            error: "not_found"
        });
    }
});

app.get("/member/:guild/:id", (req, res) => {
    var guild = client.guilds.resolve(req.params.guild);
    if(guild) {
        var member = guild.member(req.params.id);
        var user = client.users.resolve(req.params.id);
        if(member) {
            res.json({
                member,
                user
            });
        } else {
            res.status(404).json({
                error: "not_found"
            });
        }
    } else {
        res.status(404).json({
            error: "guild_not_found"
        });
    }
});

app.get("/channel/:guild/:id", (req, res) => {
    var guild = client.guilds.resolve(req.params.guild);
    if(guild) {
        var channel = guild.channels.resolve(req.params.id);
        if(channel) {
            res.json(channel);
        } else {
            res.status(404).json({
                error: "not_found"
            });
        }
    } else {
        res.status(404).json({
            error: "guild_not_found"
        });
    }
});

app.get("/message/:guild/:channel/:id", async (req, res) => {
    try {
        var guild = client.guilds.resolve(req.params.guild);
        var channel = guild.channels.resolve(req.params.channel);
        var message = await channel.messages.fetch(req.params.id);
        res.json(message);
    } catch(e) {
        res.status(404).json({
            error: "not_found"
        });
    }
});

app.get("/user/:id", (req, res) => {
    var user = client.users.resolve(req.params.id);
    if(user) {
        res.json(user);
    } else {
        res.status(404).json({
            error: "not_found"
        });
    }
});

app.get("/", (req, res) => {
    res.write(new Date().toJSON());
    res.end();
});

app.listen(8856, () => {
    console.log("Internal server ready");
});

module.exports = (cl) => {
    client = cl;
};
