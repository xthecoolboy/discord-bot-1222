const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");
const { colors } = require("../../utils");

module.exports = class ColorPreview extends commando.Command {
    constructor(client) {
        super(client, {
            name: "color",
            aliases: ["colour", "color-preview", "colour-preview"],
            memberName: "color",
            description: "Preview what a color looks like. Accepts HEX, RGB(A) and ",
            usage: "color <value>",
            group: "dev",
            args: [
                {
                    type: "string",
                    key: "value",
                    prompt: "What color do you want to view?",
                    validate: value => {
                        if(value.match(/^#?([A-F0-9]{3}|[A-F0-9]{6})$/i)) return true;
                        if(value.match(/rgba?\((\d{1,3})\s?,\s?(\d{1,3})\s?,\s?(\d{1,3})\s?(?:,\s?(\d{1,3}))?\)/i)) return true;
                        if(colors[value]) return true;

                        return false;
                    }
                }
            ]
        });
    }

    async run(msg, { value }) {
        let hex = "str";
        if(value.match(/^#?[A-F0-9]{3}$/i)) hex = value.replace("#", "").replace(/./g, "$&$&");
        else if(value.match(/^#?[A-F0-9]{6}$/i)) hex = value.replace("#", "");
        else if(value.match(/^rgb/)) {
            const arr = value
                .match(/rgba?\((\d{1,3})\s?,\s?(\d{1,3})\s?,\s?(\d{1,3})\s?(?:,\s?(\d{1,3}))?\)/i)
                .splice(1, 3);
            if(arr.some(n => n < 0 || n > 255)) return msg.say("Invalid rbg values.");
            hex = arr
                .map(ch => parseInt(ch).toString(16).padStart(2, "0"))
                .join("");
        } else if(colors[value]) hex = colors.toHex(value).replace("#", "");
        else throw new Error("An unknown error occurred with color preview command.");

        const embed = newEmbed()
            .setColor("2f3136")
            .setTitle(value)
            .setImage(`http://www.singlecolorimage.com/get/${hex}/400x100`)
            .setFooter("");
        msg.say(embed);
    }
};
