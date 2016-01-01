const uuid = require('node-uuid');

const debug = require('debug');
const forwarded = require('forwarded-for');
const http = require('http');
const express = require('express');

const app = express();

const api = require('./api');

// Hot Module Replacement enabled when not in production
if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config');
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

// Static assets at /dist
app.use(express.static('dist'));

// Our API
const APIv1 = api.v1();
app.use('/api/v1', APIv1.router);
const playerStream = APIv1.playerStream;
const playerBatch = playerStream.bufferWithTime(10).filter(x => x.length > 0);

// socket.io events
const server = new http.Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080;
const UID = process.env.MAPPY_SERVER_UID || uuid.v4();

server.listen(PORT);

debug('server uid %s', UID);

io.on('connection', (socket) => {
  const req = socket.request;
  const ip = forwarded(req, req.headers);
  debug('client ip %s', ip);

  playerBatch.subscribe((playerbatch) => {
    socket.emit('mappy:playerbatch', playerbatch);
  });
});
