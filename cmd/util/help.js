const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class HelpCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "help",
            memberName: "help",
            group: "util",
            aliases: ["commands"],
            description: "Displays a list of available commands, or detailed information for a specified command",
            usage: "help [command | command group]",
            examples: ["help", "help prefix"],
            guarded: true,
            args: [
                {
                    type: "group|command",
                    name: "command ",
                    key: "command",
                    prompt: "Which command or command group do you want details about?",
                    default: ""
                }
            ]
        });
    }

    run(msg, cmd) {
        const embed = newEmbed();
        let groups = msg.client.registry.groups;
        if(!cmd.command) {
            groups = groups
                .map(g => `- **${g.id}** (${g.name})`)
                .join("\n");
            embed
                .setTitle("Help")
                .setDescription(
                    "Please choose one of the following groups\n" +
                    groups
                );
        } else if(cmd.command instanceof commando.CommandGroup) {
            const group = cmd.command;
            const commands = group.commands
                .filter(c => !c.hidden)
                .map(c => `- **${c.name}** (${c.description})`)
                .join("\n");
            embed
                .setTitle(`${group.id} (${group.name})`)
                .setDescription(
                    `Use ${msg.anyUsage(`${this.name} <command>`)} to view more information about a command\n` +
                    "Available commands in this group:\n" +
                    commands
                );
        } else {
            const command = cmd.command;
            embed
                .setTitle(`${command.name}${command.guildOnly ? " (Usable only in servers)" : ""}${command.nsfw ? " (NSFW)" : ""}`)
                .setDescription(command.description)
                .addField("Format", `${msg.anyUsage(`${command.name}${command.format ? ` ${command.format}` : ""}`)}`);

            if(command.aliases.length) embed.addField("Aliases", command.aliases.join(", "));
            if(command.group) embed.addField("Group", `${command.group.name} (\`${command.groupID}:${command.memberName}\`)`);
            if(command.details) embed.addField("Details", command.details);
            if(command.examples && command.examples.length > 0) embed.addField("Examples", command.examples.map(e => `\`${e}\``).join("\n"));
        }

        msg.channel.send(embed);
    }
};
