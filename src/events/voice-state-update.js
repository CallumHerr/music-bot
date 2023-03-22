const Event = require('../classes/event-class.js');
const {getVoiceConnection} = require('@discordjs/voice')

module.exports = class VoiceStateUpdate extends Event {
    constructor(client) {
        super(client, 'voiceStateUpdate');
    }

    run(oldState, newState) {
        if (newState.channelId) return;
        if (newState.id !== this.client.user.id) return;

        const music = this.client.music.get(oldState.channel.guildId);
        if (!music) return;

        getVoiceConnection(oldState.channel.guildId).destroy();
        music.player.stop();
        this.client.music.delete(oldState.channel.guildId);
    }
}