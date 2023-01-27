const Event = require('../classes/event-class.js');

module.exports = class InteractionCreate extends Event {
    constructor(client) {
        super(client, 'interactionCreate');
    }

    run(interaction) {
        if (!interaction.isCommand()) return;

        const command = this.client.commands.get(interaction.commandName);
        if (!command) return;

        command.run(interaction)


    }
}