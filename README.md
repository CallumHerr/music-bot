# Open Source Music Bot

A simple open source music bot designed to replace the bots that stopped supporting YouTube searches and links. Comes with features such as queuing, pausing and putting music on repeat. Easy to use and set up.


# Setting up the bot
After downloading the files you will need to get a bot token. This can be done by creating an application on the [Discord Developer Portal](https://discord.com/developers/applications) and going to the bot section. From this page you will need to copy your bot token and put it into the config.json file.

## Inviting the bot
To invite the bot  simply go to the [Discord Developer Portal](https://discord.com/developers/applications). Now go to OAuth2 and then to URL Generator toggle on "bot" then in the new section added enable the "Administrator" permission or alternatively enable:
- Send Messages
- Embed Links
- Connect
- Speak
- Use Voice Activity

After this copy the generated URL at the bottom of the page then paste it in to google and add it to your server.

## Running the bot

After downloading the bot navigate to the parent folder of src and type the following commands:
- npm i
- npm start

The bot should now be running and ready to use in your server.
Sometimes Discord may take a minute or two in order to register all the commands.
