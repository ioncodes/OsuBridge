const DiscordBridge = require('./discord');
const IRCBridge = require('./irc');

const discord = new DiscordBridge();
const irc = new IRCBridge();

function sendIRCMessage(nick, msg) {
  irc.sendMessage(nick, msg);
}

function sendDiscordMessage(server, msg) {
  discord.sendMessage(server, msg);
}

exports.sendIRCMessage = sendIRCMessage;
exports.sendDiscordMessage = sendDiscordMessage;
