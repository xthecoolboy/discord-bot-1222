const { Command } = require("@iceprod/discord.js-commando");

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: "join",
            aliases: ["join-channel", "channel", "voice"],
            group: "music",
            memberName: "join",
            description: "Joins user active voice channel",
            examples: ["join"],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 5
            },
            clientPermissions: ["CONNECT"],
            userPermissions: ["CONNECT"]
        });
    }

    /**
     * @param msg
     * @returns {Promise.<Message|Message[]>}
     */
    async run(msg) {
        try {
            const user = msg.member;
            if(!user.voice.channel) {
                return (await msg.say("You must join voice channel first before using this command")).delete({ timeout: 2000 });
            } else {
                if(user.voice.channel.joinable) {
                    user.voice.channel.join().then(async (connection) => (await msg.say(`Joined Voice Channel - \`${connection.channel.name}\``)).delete({ timeout: 12000 }));
                } else {
                    return msg.say(`I can't join channel ${user.voiceChannel.name}. Missing permissions.`);
                }
            }
        } catch(e) {
            console.log(e);
            return msg.say("Something went horribly wrong! Please try again later.");
        }
    }
};
