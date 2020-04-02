const commando = require("discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Format extends commando.Command {
    constructor(client) {
        super(client, {
            name: "format",
            memberName: "format",
            description: "Shows information about formatting messages",
            group: "dev"
        });
    }

    run(msg) {
        var embed = newEmbed();

        embed.setTitle("Simple markdown");
        embed.setDescription("You can make your code and message more readable using simplified markdown:");

        embed.addField("Bold text", "Use 2 stars surrounding the text you want to make bold\n" +
        "\\*\\*Bold\\*\\*\n**Bold**");

        embed.addField("Italic text", "Use **1** star surrounding the text you want to make italic\n" +
        "\\*Italic\\*\n*Italic*");

        embed.addField("Inline code", "Use single backtick surrounding your code\n" +
        "\\`This is an example\\`\n`This is an example`");

        embed.addField("Multiline code with highlightning", "Use 3 backticks followed by the name of language you're using surrounding your code\n" +
        "\\```javascript\nlet example = \"this\"\n\\```\n```javascript\nlet example = \"this\"\n```");

        embed.addField("Code sharing services", "*If you want to share large chunks of code, you can use these:*\n" +
        "[codepen](https://codepen.io/) - Used for showing off front end things - supports emmet and CSS preprocessors\n" +
        "[jsfiddle](https://jsfiddle.net/) - A less distracting but just as powerful alternative to CodePen\n" +
        "[github](https://github.com/) - The ultimate code versioning, collaboration and management platform based on git");

        msg.channel.send(embed);
    }
};
