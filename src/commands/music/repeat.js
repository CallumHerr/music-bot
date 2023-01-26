const Command = require('../../classes/command-class.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class Repeat extends Command {
    constructor(client) {
        super(client, {
            name: 'repeat',
            category: 'music',
            description: 'Make the bot repeat the current song.',
        })
    }

    async run(interaction) {
        if (!interaction.member.voice.channel) {
            interaction.reply('You must be in a voice channel to use this command.');
            return;
        }

        const music = this.client.music.get(interaction.guildId);
        if (!music) return interaction.reply('I\'m not currently playing music in this server.');

        const embed = new EmbedBuilder()
            .setColor('Green')

        if (music.repeat) {
            music.repeat = false
            embed.setTitle('Repeat Disabled')
                .setDescription('Music will continue playing as normal');
        } else {
            music.repeat = true;
            embed.setTitle('Repeat Enabled')
                .setDescription('This song will now repeat until the song is skipped or i am disconnected.');
        }

        interaction.reply({ embeds: [embed] });
    }
}