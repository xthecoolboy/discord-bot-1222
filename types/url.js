const ArgumentType = require("@iceprod/discord.js-commando").ArgumentType;
const { URL } = require("url");

class URLArgumentType extends ArgumentType {
    constructor(client) {
        super(client, "url");
    }

    parse(val, msg, arg) {
        return new URL(val);
    }

    validate(val, msg, arg) {
        var pattern = new RegExp("^https?:\\/\\/" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
        try {
            var s = new URL(val);
            s.toString();
        } catch(e) {
            return false;
        }
        return !!pattern.test(val);
    }
}

module.exports = URLArgumentType;
