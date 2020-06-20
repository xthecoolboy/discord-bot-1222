const account = require("../managers/accountManager");
const ArgumentType = require("@iceprod/discord.js-commando").ArgumentType;

class UUIDAsyncType extends ArgumentType {
    /**
     * @param client
     */
    constructor(client) {
        super(client, "uuid-async");
    }

    /**
     * @param value string
     * @param msg CommandMessage
     * @param arg
     * @returns {*}
     */
    async parse(value, msg, arg) {
        var dbuser = await account.fetchUserUUID(value);
        if(dbuser) {
            var member = await msg.client.fetchUser(dbuser.discord);
            return { dbuser, member };
        } else return null;
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

module.exports = UUIDAsyncType;
