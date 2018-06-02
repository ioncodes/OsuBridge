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
        channel.sendMessage(`${greeting.random()} ${member}! I'm currently serving ${this.servers.length} servers!`);
      }
      if(msg.content === 'osu!bridge hello') {
        let channel = msg.channel;
        let member = msg.member;
        channel.sendMessage(`${greeting.random()} ${member}!`);
      }
    });

    client.login(process.env.BOT_TOKEN);
  }

  loadServer(server) {
    // init discord server bridge
  }
}

module.exports = DiscordBridge;
