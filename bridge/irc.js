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

    this.client.addListener('error', function(message) {
      logger.error(message);
    });

    this.client.addListener('pm', function (from, message) {
      logger.info(`Received msg from ${from}: ${message}`);
    });

    this.client.addListener('selfMessage', function (to, message) {
      logger.info(`Sent msg to ${to}: ${message}`);
    });
  }

  sendMessage(nick, msg) {
    this.client.say(nick, msg);
  }
}

module.exports = IRCBridge;
