const commando = require("@iceprod/discord.js-commando");

module.exports = class Role extends commando.Command {
    constructor(client) {
        super(client, {
            name: "role",
            aliases: ["r", "roles"],
            group: "mod",
            memberName: "role",
            description: "Add, remove or toggle a role on a user",
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MANAGE_ROLES"],
            args: [{
                type: "string",
                key: "option",
                oneOf: ["add", "remove", "toggle"],
                prompt: "Please select an option: `<add | remove | toggle>`"
            },
            {
                type: "user",
                key: "user",
                prompt: "Which user would you like to select?"
            },
            {
                type: "role",
                key: "role",
                prompt: "Which role would you like to select?"
            }
            ]
        });
    }

    run(msg, cmd) {
        if(msg.member.guild.me.roles.highest.comparePositionTo(cmd.role) <= 0) return msg.say("The bot can't manage this role because it's not high enough in the role hierachy!");

        if(msg.guild.member(msg.author).roles.highest.comparePositionTo(cmd.role) <= 0) { return msg.say("You can't manage this role!"); }
        if(msg.guild.member(msg.author).roles.highest.comparePositionTo(cmd.user.roles.highest) <= 0) { return msg.say("You can't manage this user!"); }

        switch(cmd.option) {
            case "add":
                msg.guild.member(cmd.user).addRole(cmd.role);
                msg.say(`Successfully added ${cmd.role} to ${cmd.user}!`);
                break;
            case "remove":
                msg.guild.member(cmd.user).removeRole(cmd.role);
                msg.say(`Successfully removed ${cmd.role} from ${cmd.user}!`);
                break;
            case "toggle":
                if(msg.member.roles.has(cmd.role.id)) {
                    msg.guild.member(cmd.user).removeRole(cmd.role);
                    msg.say(`Successfully removed ${cmd.role} from ${cmd.user}!`);
                } else {
                    msg.guild.member(cmd.user).addRole(cmd.role);
                    msg.say(`Successfully added ${cmd.role} to ${cmd.user}!`);
                }
                break;
            default:
                msg.say("Something went wrong...");
        }
    }
};
