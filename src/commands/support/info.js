const { EmbedBuilder, AutoModerationRuleKeywordPresetType } = require('discord.js');
const Command = require('../../classes/command-class.js');

module.exports = class Info extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            category: 'support',
            description: 'Get info about the bot',
        })
    }

    run(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Bot Info')
            .setDescription('Open Source bot created as a replacement for the bots that have stopped supporting youtube links and searches.')
            .addFields(
                { name: 'Source', value: '[Github](https://github.com/CallumHerr/music-bot)'},
                { name: 'Other Projects', value: '[My website](https://callum.one/)'}
            );
            
        interaction.reply({embeds: [embed]});
    }
}