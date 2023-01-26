const Command = require('../../classes/command-class.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class ClearQueue extends Command {
    constructor(client) {
        super(client, {
            name: 'clearqueue',
            category: 'music',
            description: 'Clear all the songs from the current queue.',
        })
    }

    async run(interaction) {
        if (!interaction.member.voice.channel) {
            interaction.reply('You must be in a voice channel to use this command.');
            return;
        }

        const music = this.client.music.get(interaction.guildId);
        if (!music) return interaction.reply('I\'m not currently playing music in this server.');

        music.queue = [[music.queue[0][0], music.queue[0][1]]];

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Queue Cleared')
            .setDescription('Queue has been successfully cleared.');

        interaction.reply({ embeds: [embed] });
    }
}