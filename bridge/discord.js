const Discord = require('discord.js');
const logger = require('../logger');
const greeting = require('greeting');

class DiscordBridge {
  constructor() {
    this.servers = [];

    const client = new Discord.Client();

    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', msg => {
      if(msg.content === 'osu!bridge register') {
        let channel = msg.channel;
        let member = msg.member;
        let server = msg.guild;
        if(member.hasPermission('ADMINISTRATOR')) {
          logger.info(`Registered channel ${channel} on server ${server} (requested by ${member})`);
          this.servers.push({
            server: server,
            channel: channel,
          });
          msg.reply(`registered channel ${channel}!`);
        } else {
          logger.warn(`Registering denied (requested by ${member})`);
          msg.reply(`only administrators can register channels!`);
        }
      }
      if(msg.content === 'osu!bridge logs') {
        // DOESNT WORK, THERE'S A BUG IN WINSTON

        let member = msg.member;
        let channel = msg.channel;

        if(member.hasPermission('ADMINISTRATOR')) {
          const options = {
            from: new Date() - (24 * 60 * 60 * 1000),
            until: new Date(),
            limit: 10,
            start: 0,
            order: 'desc',
            fields: ['message']
          };
          logger.query(options, function (err, results) {
            if(err) {
              throw err;
            }

            logger.info(`Displaying logs (requested by ${member})`);

            channel.sendMessage(`\`\`\`${results}\`\`\``);
          });
        } else {
          logger.warn(`Querying logs denied (requested by ${member})`);
          msg.reply(`only administrators can query logs!`);
        }
      }
      if(msg.content === 'osu!bridge stats') {
        let channel = msg.channel;
        let member = msg.member;
        channel.send({embed: {
          color: 0xDC98A4,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: 'OsuBridge',
          url: 'https://github.com/ioncodes/OsuBridge',
          description: 'Beep Boop!',
          fields: [{
            name: '⚡ Servers',
            value: `Serving ${this.servers.length} servers`
          }],
          timestamp: new Date(),
          footer: {
            icon_url: 'https://cdn.discordapp.com/avatars/292314830667382785/8be27727f9de394e7878d064263a3e62.png?size=256',
            text: '© ioncodes (ion#0122)'
          }
        }});
      }
      if(msg.content === 'osu!bridge hello') {
        let channel = msg.channel;
        let member = msg.member;
        channel.sendMessage(`${greeting.random()} ${member}!`);
      }
      if(msg.content === 'osu!bridge help') {
        // TODO: Implement rich message for commands/help
        let channel = msg.channel;
        channel.sendMessage(`Commands: `);
      }
    });

    client.login(process.env.BOT_TOKEN);
  }

  loadServer(server) {
    // init discord server bridge
  }
}

module.exports = DiscordBridge;
