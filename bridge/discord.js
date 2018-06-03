const Discord = require('discord.js');
const logger = require('../logger');
const greeting = require('greeting');
const interconnect = require('./interconnect');

class DiscordBridge {
  constructor() {
    this.servers = [];

    const client = new Discord.Client();

    client.on('ready', () => {
      logger.info(`Logged in to Discord as ${client.user.tag}!`);
    });

    client.on('message', msg => {
      if(msg.author === client.user) { return; }
      if(msg.content === 'osu!bridge register') {
        let channel = msg.channel;
        let member = msg.member;
        let server = msg.guild;
        if(member.hasPermission('ADMINISTRATOR')) {
          logger.info(`Registered channel ${channel} on server ${server} (requested by ${member})`);
          this.servers.push({
            server: server,
            channel: channel,
            osu_account: null
          });
          msg.reply(`registered channel ${channel}!`);
        } else {
          logger.warn(`Registering denied (requested by ${member})`);
          msg.reply(`only administrators can register channels!`);
        }
      }
      else if(msg.content.startsWith('osu!bridge link ')) {
        let channel = msg.channel;
        let user = msg.content.replace('osu!bridge link ', '');
        logger.info(`Linking ${user} with ${channel}`);
        this.servers.forEach((server) => {
          if(server.channel === channel) {
            server.osu_account = user;
          }
        });
      }
      else if(msg.content === 'osu!bridge logs') {
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
      else if(msg.content === 'osu!bridge stats') {
        let channel = msg.channel;
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
      else if(msg.content === 'osu!bridge hello') {
        let channel = msg.channel;
        let member = msg.member;
        channel.sendMessage(`${greeting.random()} ${member}!`);
      }
      else if(msg.content === 'osu!bridge help') {
        let channel = msg.channel;
        channel.send({embed: {
          color: 0xDC98A4,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: 'Help',
          url: 'https://github.com/ioncodes/OsuBridges',
          description: `Beep Boop! I'm OsuBridge and this is the help menu.`,
          fields: [{
            name: 'help',
            value: 'Shows this menu.'
          },{
            name: 'register',
            value: 'Registers the current channel as bridge to osu!'
          },{
            name: 'stats',
            value: 'Shows global OsuBridge stats!'
          },{
            name: 'hello',
            value: '⚠️ CAUTION ⚠️ Use this only if you have no friends to greet!'
          }],
          timestamp: new Date(),
          footer: {
            icon_url: 'https://cdn.discordapp.com/avatars/292314830667382785/8be27727f9de394e7878d064263a3e62.png?size=256',
            text: '© ioncodes (ion#0122)'
          }
        }});
      }
      else {
        let channel = msg.channel;
        this.servers.forEach((server) => {
          if(server.channel === channel) {
            interconnect.sendIRCMessage(server.osu_account, msg.content);
          }
        });
      }
    });

    client.login(process.env.BOT_TOKEN);
  }

  loadServer(server) {
    // init discord server bridge
  }

  sendMessage(server, msg) {
    // send message to channel
  }
}

module.exports = DiscordBridge;
