const ArgumentType = require("@iceprod/discord.js-commando").ArgumentType;

class UUIDType extends ArgumentType {

    /**
     * @param client
     */
    constructor(client) {
        super(client, "uuid");
    }

    /**
     * @param value string
     * @param msg CommandMessage
     * @param arg
     * @returns {*}
     */
    parse(value, msg, arg) {
        return value;
    }

    /**
     * Validates passed argument
     * @param value
     * @param msg
     * @param arg
     * @returns {*}
     */
    validate(value, msg, arg) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    }
}

module.exports = UUIDType;
