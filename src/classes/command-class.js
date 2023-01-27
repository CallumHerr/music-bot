const { SlashCommandBuilder } = require("discord.js");

/**
 * info.arguments
 * @property {string} name - name of the argument
 * @property {string} type - Boolean | Channel | Integer | Number | Role | String | User
 * @property {string} description - short summary of what the argument is
 * @property {boolean} required - If the argument is needed
 */

module.exports = class Command {
    constructor(client, info) {
        this.client = client;
        this.name = info.name;
        this.category = info.category;
        this.description = info.description;
        this.arguments = info.arguments || [];
        this.data = new SlashCommandBuilder();
    }

    generate() {
        this.data.setName(this.name)
            .setDescription(this.description)
            .setDMPermission(!this.guildOnly)
        for (const arg of this.arguments) {
            switch (arg.type) {
                case 'Boolean':
                    this.data.addBooleanOption(option => 
                        option
                            .setName(arg.name)
                            .setDescription(arg.description)
                            .setRequired(arg.required))
                    break;
                case 'Channel':
                    this.data.addChannelOption(option => 
                        option
                            .setName(arg.name)
                            .setDescription(arg.description)
                            .setRequired(arg.required))
                    break;
                case 'Integer':
                    this.data.addIntegerOption(option => 
                        option
                            .setName(arg.name)
                            .setDescription(arg.description)
                            .setRequired(arg.required))
                    break;
                case 'Number':
                    this.data.addNumberOption(option => 
                        option
                            .setName(arg.name)
                            .setDescription(arg.description)
                            .setRequired(arg.required))
                    break;
                case 'Role':
                    this.data.addRoleOption(option => 
                        option
                            .setName(arg.name)
                            .setDescription(arg.description)
                            .setRequired(arg.required))
                    break;
                case 'String':
                    this.data.addStringOption(option => 
                        option
                            .setName(arg.name)
                            .setDescription(arg.description)
                            .setRequired(arg.required))
                    break;
                case 'User':
                    this.data.addUserOption(option => 
                        option
                            .setName(arg.name)
                            .setDescription(arg.description)
                            .setRequired(arg.required))
                    break;
            }
        }
    }

    run(...params) {
        console.log(this.name)
    }
}