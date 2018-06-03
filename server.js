const express = require('express');
const path = require('path');
const logger = require('./logger');
const interconnect = require('./bridge/interconnect');

const app = express();

app.use('/api/discord', require('./api/discord'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(50451, () => {
  logger.info('Started server on port 50451');
});

app.use((err, req, res, next) => {
  logger.error(`Something weird happened ${err}`);
  switch (err.message) {
    case 'NoCodeProvided':
      return res.status(400).send({
        status: 'ERROR',
        error: err.message,
      });
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});
