const { EmbedBuilder, AutoModerationRuleKeywordPresetType } = require('discord.js');
const Command = require('../../classes/command-class.js');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            category: 'support',
            description: 'Get list of commands or info on a specific one',
            arguments: [
                {
                    name: 'command',
                    type: 'String',
                    description: 'Command you want info about',
                    required: false,
                }
            ]
        })
    }

    run(interaction) {
        const commandInput = interaction.options.getString('command');
        let command;
        if (commandInput) {
            command = this.client.commands.get(commandInput.toLowerCase());
        }

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Help')
            .setFooter({ text: 'For more projects check out DuckXYZ.com' });
        if (!command) {
                embed.setDescription('To get info on a specific command try `/help CommandName`');
            for (const cat of this.client.categories) {
                const commands = this.client.commands.filter(cmd =>cmd.category === cat)
                    .map(c => c.name);
                embed.addFields({
                    name: cat, value:
                    `\`${commands.join('`, `')}\``
                });
            }
        } else {
            embed.setTitle(`${command.name} - ${command.category}`)
                .setDescription(command.description)
            if (command.arguments.length > 0) {
                embed.addFields({
                    name: 'Arguments',
                    value: `\`${command.arguments.map(a => `${a.name} - ${a.required ? 'Required' : 'Optional'}`).join('`, `')}\``
                })
            }
        }

        interaction.reply({ embeds: [embed] })
    }
}