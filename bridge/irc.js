const irc = require('irc');
const logger = require('../logger');

class IRCBridge {
  constructor() {
    this.server = 'irc.ppy.sh';
    this.port = 6667;
    this.username = 'ioncodes';
    this.password = process.env.IRC_TOKEN;

    this.client = new irc.Client(this.server, this.username, {
      password: this.password,
      port: this.port,
      userName: this.username,
      channels: [],
    });

    this.client.addListener('error', (message) => {
      logger.error(message);
    });

    this.client.addListener('registered', () => {
      logger.info(`Connected to IRC as ${this.username}`);
    });

    this.client.addListener('pm', (from, message) => {
      logger.info(`Received msg from ${from}: ${message}`);
    });

    this.client.addListener('selfMessage', (to, message) => {
      logger.info(`Sent msg to ${to}: ${message}`);
    });
  }

  sendMessage(nick, msg) {
    this.client.say(nick, msg);
  }
}

module.exports = IRCBridge;
