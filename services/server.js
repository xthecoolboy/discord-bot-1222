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
