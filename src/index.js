const {Client, GatewayIntentBits, Collection, REST, Routes} = require('discord.js');
const fs = require('fs');
const {token} = require('../config.json');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
client.music = new Collection();
client.categories = [];
const commandsData = [];

client.once('ready', async () => {
    const categories = fs.readdirSync(__dirname + '/commands');
    for (const cat of categories) {
        if (cat.endsWith('.js')) continue;
        const commands = fs.readdirSync(__dirname + `/commands/${cat}`);
        for (const command of commands) {
            const cmdClass = require(__dirname + `/commands/${cat}/${command}`);
            const cmd = new cmdClass(client);
            cmd.generate();
            commandsData.push(cmd.data.toJSON());
            client.commands.set(cmd.name, cmd);
            if (client.categories.indexOf(cmd.category) === -1) client.categories.push(cmd.category);
        }
    }

    const events = fs.readdirSync(__dirname + '/events');
    for (const eventFile of events) {
        if (!eventFile.endsWith('.js')) continue;
        const eventClass = require(__dirname + `/events/${eventFile}`);
        const event = new eventClass(client);
        client.on(event.name, (...params) => event.run(...params)); 
    }

    console.log(`Loading ${commandsData.length} commands`)
    const rest = new REST({ version: '10' }).setToken(token)

    const data = await rest.put(
        Routes.applicationCommands(client.user.id),
        {body: commandsData}
    )
    console.log(`Bot online with ${data.length} commands`)
})

client.login(token)