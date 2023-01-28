const Command = require('../../classes/command-class.js');
const { EmbedBuilder } = require('discord.js');
const youtube = require('play-dl');
const { getVoiceConnection, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = class Skip extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            category: 'music',
            description: 'Force the bot to play the next song in the playlist.',
        })
    }

    async run(interaction) {
        if (!interaction.member.voice.channel) {
            interaction.reply('You must be in a voice channel to use this command.');
            return;
        }

        const music = this.client.music.get(interaction.guildId);
        if (!music) return interaction.reply('Nothing is currently playing.');
        
        if (music.queue.length < 2) {
            getVoiceConnection(interaction.guildId).destroy();
            interaction.reply('No songs remaining in queue. Bot Disconnected.');
            return;
        }

        music.repeat = false;
        const newSong = music.queue[1]
        music.player.emit(AudioPlayerStatus.Idle, (interaction.guildId, this.client, music));

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Song Skipped')
            .setDescription(`Now playing [${newSong[0]}](${newSong[1]})`);
        interaction.reply({ embeds: [embed] });
    }
}