const Command = require('../../classes/command-class.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class NowPlaying extends Command {
    constructor(client) {
        super(client, {
            name: 'nowplaying',
            category: 'music',
            description: 'See the song currently playing in the VC.',
        })
    }

    async run(interaction) {
        const music = this.client.music.get(interaction.guildId);
        if (!music) return interaction.reply('I\'m not currently playing music in this server.');

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Now Playing!')
            .setDescription(`Currently playing: [${music.queue[0][0]}](${music.queue[0][1]})`)
            .setFooter({ text: `Current queue length: ${music.queue.length}/50` });

        interaction.reply({ embeds: [embed] });
    }
}