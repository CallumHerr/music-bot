const Event = require('../classes/event-class.js');
const {
    createAudioPlayer,
    AudioPlayerStatus,
    getVoiceConnection,
    createAudioResource,
    joinVoiceChannel
} = require('@discordjs/voice');
const {EmbedBuilder} = require('discord.js');

async function idlePlayer(client, music) {
    if (!music || music.skipping) return;
    if (music.queue.length < 2) {
        getVoiceConnection(guildId).destroy();
    } else {
        music.queue.shift();
        const stream = await youtube.stream(music.queue[0][1]);
        const resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });

        music.player.play(resource);
    }
}

module.exports = class Video extends Event {
    constructor(client) {
        super(client, 'video');
    }

    async run(interaction) {
        const guildId = interaction.guildId;
        const music = this.client.music.get(guildId);

        if (music.queue.length === 50) return interaction.reply('Sorry the queue is full.');

        const link = interaction.options.getString('song');
        const videoInfo = await youtube.video_info(link);
        music.queue.push([videoInfo.video_details.title, link]);

        if (!music.player) {
            const player = createAudioPlayer();
            player.on(AudioPlayerStatus.Idle, () => idlePlayer(this.client, music));
            music.player = player;

            let connection = getVoiceConnection(guildId);
            if (!connection) {
                connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: guildId,
                    adapterCreator: messageLink.guild.voiceAdapterCreator
                })
            }

            connection.subscribe(player);
            const stream = await youtube.stream(music.queue[0][1]);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });
            player.play(resource);
        }

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Queue Updated')
            .setDescription(`Video added [${videoInfo.video_details.title}](${link})`)
            .setFooter(`Current queue size: ${music.queue.length}/50`);
        interaction.reply({ embeds: [embed] })
    }
}