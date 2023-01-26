const Command = require('../../classes/command-class.js');
const youtube = require('play-dl');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const {
    AudioPlayerStatus,
    getVoiceConnection,
    createAudioResource,
    joinVoiceChannel,
    createAudioPlayer
} = require('@discordjs/voice');

async function idlePlayer(guildId, client, music) {
    if (!music || music.skipping) return;
    if (music.queue.length < 2) {
        getVoiceConnection(guildId).destroy()
        music.player.stop();
        client.music.delete(guildId);
        return;
    }

    if (!music.repeat) {
        music.queue.shift();
    }

    const stream = await youtube.stream(music.queue[0][1]);
    const resource = createAudioResource(stream.stream, {
        inputType: stream.type
    });

    music.player.play(resource);
}

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            category: 'music',
            description: 'Play a song from youtube using a search or link',
            arguments: [
                {
                    name: 'song',
                    type: 'String',
                    description: 'song to search for',
                    required: true,
                }
            ]
        })
    }

    async run(interaction) {
        if (!interaction.member.voice.channel) {
            interaction.reply('You must be in a voice channel to use this command.');
            return;
        }

        let music = this.client.music.get(interaction.guildId);
        if (!music) {
            music = {
                channelId: interaction.guild.id,
                queue: []
            }
            this.client.music.set(interaction.guild.id, music);
            music = this.client.music.get(interaction.guildId);
        }
        if (music.queue.length === 50) return interaction.reply('Sorry the queue is currently full');

        const input = interaction.options.getString('song');
        const searchType = youtube.yt_validate(input);
        let songsAdded;

        interaction.deferReply();

        if (searchType === 'video') {
            const videoInfo = await youtube.video_info(input);
            music.queue.push([videoInfo.video_details.title, input]);
            songsAdded = 1;

        } else if (searchType === 'playlist') {
            let playlistInfo;
            try {
                playlistInfo = await youtube.playlist_info(input)
            } catch (e) {
                interaction.followUp('Sorry this type of playlist isn\'t currently supported.');
                return
            };
            const songLimit = 50 - music.queue.length;
            songsAdded = 0;
            for (let i = 0; i < songLimit && i < playlistInfo.videos.length; i++) {
                if (playlistInfo.videos[i].durationInSec >= 3600) break;
                music.queue.push([playlistInfo.videos[i].title, playlistInfo.videos[i].url])
                songsAdded += 1;
            }

        } else {
            const params = { limit: 5, source: { youtube: 'video' }};
            const searchResults = await youtube.search(input, params);
            if (searchResults.length < 0) {
                return interaction.followUp('Sorry i couldn\'t find a video with that name.');
            }

            let videos;
            for (let i = 0; i < searchResults.length; i++) {
                videos += `[**${i+1}:** ${searchResults[i].title}](${searchResults[i].url})\n`;
            }

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Search Complete')
                .setDescription('Please select the video you would like to play:\n' + videos)
                .setFooter({ text: 'You can also search using a URL!' });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('0')
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel('1'),
                    new ButtonBuilder()
                        .setCustomId('1')
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel('2'),
                    new ButtonBuilder()
                        .setCustomId('2')
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel('3'),
                    new ButtonBuilder()
                        .setCustomId('3')
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel('4'),
                    new ButtonBuilder()
                        .setCustomId('4')
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel('5'),
                )

            const msg = await interaction.followUp({
                embeds: [embed],
                components: [row]
            });

            const int = await msg.awaitMessageComponent({ time: 15000, dispose: true })
                .catch(() => {
                    embed.setColor('Red')
                        .setTitle('Search Failed')
                        .setDescription('You did not select a song in time.');
                    interaction.editReply({ embeds: [embed] });
                    return;
                })

            interaction.deleteReply()
            const song = searchResults[parseInt(int.customId)];
            music.queue.push([song.title, song.url]);
            songsAdded = 1;
        
        }

        if (!music.player) {
            const player = createAudioPlayer();
            player.on(AudioPlayerStatus.Idle, () => idlePlayer(interaction.guildId, this.client, music));
            music.player = player;

            let connection = getVoiceConnection(interaction.guildId);
            if (!connection) {
                connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                })
            }

            connection.subscribe(player);
            console.log(music.queue)
            const stream = await youtube.stream(music.queue[0][1]);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });
            player.play(resource);
        }

        let embed = new EmbedBuilder();

        if (songsAdded) {
            embed.setColor('Green')
                .setTitle('Queue Updated')
                .setFooter({ text: `Current queue size: ${music.queue.length}/50`})
            if (songsAdded === 1) {
                const songAdded = music.queue[music.queue.length-1]
                embed.setDescription(`video added [${songAdded[0]}](${songAdded[1]})`)
            } else {
                embed.setDescription(`Successfully added ${songsAdded} songs.`)
            }
        } else {
            embed.setColor('Red')
                .setTitle('Something went wrong')
                .setDescription('A problem occured adding songs to the queue, please try again.');
        }

        interaction.followUp({ embeds: [embed] });
    }
}