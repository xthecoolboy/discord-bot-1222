const newEmbed = require("../../embed");

module.exports = async (msg) => {
    if (msg.author.bot) return;
    if (!/https:\/\/discordapp.com\/channels\/[0-9]+\/[0-9]+\/[0-9]+(?: .*)/.test(msg.content)) return;

    var [,,,, server, channel, message] = msg.content.split("/");
    message = message.split(" ")[0];

    try {
        server = msg.client.guilds.get(server);
        channel = server.channels.get(channel);
    } catch (e) { return; }

    var embed;
    try {
        var mess = await channel.fetchMessage(message);

        if (!mess) return;

        embed = newEmbed();
        embed.description = mess.cleanContent;
        embed.setAuthor(mess.author.tag, mess.author.avatarURL);

        if (mess.attachments.length) {
            if (mess.attachments.length === 1) {
                for (var attachment of mess.attachments) {
                    if (attachment.width) {
                        embed.setImage(attachment.proxyURL);
                    } else {
                        embed.addField("Attachments", "Message has one attachment (not an image).");
                    }
                }
            } else {
                embed.addField("Attachments", `Message has ${mess.attachments.length} attachments.`);
            }
        }

        if (mess.tts) {
            embed.addField("TTS", "The message was sent as Text-To-Speech.");
        }

        if (mess.webhookID) {
            embed.addField("Webhook", "The message was sent from webhook.");
        }

        if (mess.system) {
            embed.addField("System", "The message was sent as system message by Discord.");
        }

        if (mess.pinned) {
            embed.addField("Pinned", "The message has been pinned in the channel.");
        }

        if (mess.hit) {
            embed.addField("Hit", "The message is a hit in a search");
        }

        if (mess.deleted) {
            embed.addField("Deleted", "The message has been deleted");
            embed.setDescription("[DELETED]");
        }

        if (mess.edited) {
            embed.addField("Edited", "The message has been edited");
        }

        msg.channel.send(embed);
    } catch (e) {
        embed = newEmbed();

        embed.setAuthor("[DELETED]", "http://icon-library.com/images/yellow-discord-icon/yellow-discord-icon-24.jpg");
        embed.setDescription("[DELETED]");

        embed.addField("Deleted", "The message has been deleted.");

        msg.channel.send(embed);
    }
};
