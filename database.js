const sqlite3 = require('sqlite3').verbose();
const logger = require('./logger');
const fs = require('fs');

if(!fs.existsSync('db')) {
  fs.mkdirSync('db');
}

var createTable = false;

if(!fs.existsSync('./db/osu_bridge.sqlite3')) {
  createTable = true;
}

const db = new sqlite3.Database('./db/osu_bridge.sqlite3', (error) => {
  if(!error) {
    logger.info('Successfully opened database');
  } else {
    logger.error(`Failed opening database: ${error}`);
  }
});

if(createTable) {
  db.run('CREATE TABLE servers (server TEXT, channel TEXT, osu_account TEXT)');
  logger.info(`Created table`);
}

function loadServers(cb) {
  db.serialize(function() {
    db.all('SELECT server, channel, osu_account FROM servers', function(err, rows) {
      logger.info(`Loaded ${rows.length} servers`);
      cb(rows);
    });
  });
}

function addServer(server) {
  db.run(`INSERT INTO servers VALUES ("${server.server}", "${server.channel}", "${server.osu_account}")`);
  logger.info(`Adding new server: ${server}`);
}

function linkOsuAccount(channel, user) {
  db.run(`UPDATE servers SET osu_account = "${user}" WHERE channel = "${channel}"`);
  logger.info(`Linked ${user} to ${channel}`);
}

exports.loadServers = loadServers;
exports.addServer = addServer;
exports.linkOsuAccount = linkOsuAccount;
