const commando = require("@iceprod/discord.js-commando");
var http = require("https");
const newEmbed = require("../../embed");
var unirest = require("unirest");

module.exports = class Urban extends commando.Command {
    constructor(client) {
        super(client, {
            name: "urban",
            aliases: ["ud"],
            memberName: "urban",
            description: "Find the meaning in the Urban Dictionary",
            usage: "urban <text>",
            group: "fun",
            hidden: true,
            args: [
                {
                    type: "string",
                    key: "text",
                    prompt: "What is the word do you want to look up?"
                }
            ]
        });
    }
    run(msg, cmd) {
      var req = unirest("GET", "https://mashape-community-urban-dictionary.p.rapidapi.com/define");

req.query({
	"term": cmd.text
});

req.headers({
	"x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
	"x-rapidapi-key": "5bfd40b74dmsh24c1dff6c53254ep1a3d24jsn44d02f3d0d69"
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);
  var body = res.body;
  if (body.list.length == 0){
    var embed = newEmbed();
    embed.setTitle("Undefined");
    embed.setDescription("This word isn't defined in Urban Dictionary");
    msg.channel.send(embed);
  } else {
    var popular = body.list[0];
    var regex = new RegExp(/\[[^\]]*]/g);
    var def = popular.definition;
    def = def.replace(regex, function(match, token) {
    return match.replace(/\[([a-z0-9 ]+)\]/gi, (w, group) => {
  return `[${group}](https://www.urbandictionary.com/define.php?term=${encodeURI(group)})`;
});
});
    var exp = popular.example;
    exp = exp.replace(regex, function(match, token) {
    return match.replace(/\[([a-z0-9 ]+)\]/gi, (w, group) => {
  return `[${group}](https://www.urbandictionary.com/define.php?term=${encodeURI(group)})`;
});
});
    var embed = newEmbed();
    embed.setTitle(popular.word);
    embed.setDescription(def);
    embed.setURL(popular.permalink);
    embed.addField("Example", "*"+exp+"*");
    embed.addField("Thumbs Up", ":+1: "+popular.thumbs_up);
    msg.channel.send(embed);

  }

});
}


};
