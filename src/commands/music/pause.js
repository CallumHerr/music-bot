const Command = require('../../classes/command-class.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class Pause extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            category: 'music',
            description: 'Pause the current music playing in the VC.',
        })
    }

    async run(interaction) {
        if (!interaction.member.voice.channel) {
            interaction.reply('You must be in a voice channel to use this command.');
            return;
        }

        const music = this.client.music.get(interaction.guildId);
        if (!music) return interaction.reply('I\'m not currently playing music in this server.');

        if (!music.paused) {
            music.paused = true;
            music.player.pause();
            interaction.reply('Music has been paused.');
        } else {
            music.paused = false;
            music.player.unpause();
            interaction.reply('Music is playing again.');
        }
    
    }
}