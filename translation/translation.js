const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = () => {
    var files = fs.readdirSync(path.join(__dirname, "/sources"));
    var col = new Collection();

    var skip = false;
    for(var ilanguage in files) {
        if(skip) {
            skip = false;
            continue;
        }
        var language = files[ilanguage];
        var lang = language.substr(0, language.indexOf("."));
        var langCommands = lang + ".commands";
        if(!fs.existsSync(path.join(__dirname, "/sources", langCommands + ".js"))) {
            console.error("Missing commands data");
            continue;
        }
        skip = true;
        col.set(lang, {
            lang: require("./sources/" + lang),
            commands: require("./sources/" + langCommands)
        });
    }

    return col;
};
