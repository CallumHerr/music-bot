const Event = require('../classes/event-class.js');

module.exports = class InteractionCreate extends Event {
    constructor(client) {
        super(client, 'interactionCreate');
    }

    run(interaction) {
        if (!interaction.isCommand()) return;

        const command = this.client.commands.get(interaction.commandName);
        if (!command) return;

        if (command.guildOnly && !interaction.guild) {
            return interaction.reply('This command is for servers only.');
        }

        if (command.guildOnly) {
            if (command.userPerms.length > 0 && !interaction.memberPermissions.has(command.userPerms)) {
                return interaction.reply({
                    content: `For this command you need the permissions: \`${command.userPerms.join('`, `')}\``,
                    ephemeral: true
                })
            }
            const botPerms = interaction.guild.members.me.permissions;
            if (command.botPerms.length > 0 && !botPerms.has(command.botPerms)) {
                return interaction.reply({
                    content: `For this command i need the perms: \`${command.botPerms.join('`, `')}\``,
                    ephemeral: true
                })
            }
        }

        command.run(interaction)


    }
}