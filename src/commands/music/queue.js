const Command = require('../../classes/command-class.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = class Queue extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            category: 'music',
            description: 'Display all the songs currently in queue.',
        })
    }

    async run(interaction) {
        const music = this.client.music.get(interaction.guildId);
        if (!music) return interaction.reply('I\'m not currently playing music in this server.');

        const queueSize = music.queue.length;
        let queue = '';
        let songsShown = 10;
        for (let i = 0; i < queueSize && i < songsShown; i++) {
            const song = music.queue[i];
            queue += `[${i+1}. ${song[0]}](${song[1]})\n`;
        }

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Queue')
            .setDescription(queue)
            .setFooter({ text: `Current queue size: ${queueSize}/50` });

        if (queueSize < songsShown) {
            interaction.reply({ embeds: [embed] });
            return;
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️'),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('➡️')
            );

        const msg = await interaction.reply({
            embeds: [embed],
            components: [row]
        })

        const filter = i => i.customId === 'previous' || i.customId === 'next';
        const collector = msg.createMessageComponentCollector({ filter });

        let idleTimer = setTimeout(() => {
            interaction.editReply({ embeds: [embed], components: []});
            collector.stop();
        }, 15000)

        let page = 0;
        const maxPage = Math.ceil(queueSize / 10)-1;
        collector.on('collect', int => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                interaction.editReply({ embeds: [embed], components: []});
                collector.stop();
            }, 15000);

            if (int.customId === 'previous') {
                if (page === 0) page = maxPage;
                else page--;
            } else {
                if (page === maxPage) page = 0;
                else page++;
            }

            const index = page * songsShown;
            queue = '';
            for (let i = index; i < index+10 && i < queueSize; i++) {
                const song = music.queue[i];
                queue += `[${i+1}. ${song[0]}](${song[1]})\n`;
            }

            embed.setDescription(queue);
            int.update({ embeds: [embed], components: [row]})
        })

    }
}