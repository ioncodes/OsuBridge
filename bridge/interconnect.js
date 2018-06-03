const DiscordBridge = require('./discord');
const IRCBridge = require('./irc');

const discord = new DiscordBridge();
const irc = new IRCBridge();

function sendIRCMessage(nick, from, msg) {
  irc.sendMessage(nick, `${from}: ${msg}`);
}

function sendDiscordMessage(nick, msg) {
  discord.sendMessage(nick, `${nick}: ${msg}`);
}

exports.sendIRCMessage = sendIRCMessage;
exports.sendDiscordMessage = sendDiscordMessage;
