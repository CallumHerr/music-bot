const Command = require('../../classes/command-class.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class Stop extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            category: 'music',
            description: 'Make the bot disconnect from the current channel and stop playing music.',
        })
    }

    async run(interaction) {
        if (!interaction.member.voice.channel) {
            interaction.reply('You must be in a voice channel to use this command.');
            return;
        }

        const music = this.client.music.get(interaction.guildId);
        if (!music) return interaction.reply('I\'m not currently playing music in this server.');

        music.queue = [];
        music.player.stop();
        this.client.music.delete(interaction.guildId);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Music Stopped')
            .setDescription('Music has successfully stopped and the queue has been cleared.');

        interaction.reply({ embeds: [embed] });
    }
}