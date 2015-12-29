const uuid = require('node-uuid');

const debug = require('debug');
const forwarded = require('forwarded-for');
const http = require('http');
const app = require('express')();

const server = new http.Server(app);
const io = require('socket.io')(server);

const fakes = require('./fake-events');

const fakePlayerBatch = fakes.generatePlayerData()
  .bufferWithTime(10);

const PORT = process.env.PORT || 8090;
const UID = process.env.MAPPY_SERVER_UID || uuid.v4();

server.listen(PORT);

debug('server uid %s', UID);

io.on('connection', (socket) => {
  const req = socket.request;
  const ip = forwarded(req, req.headers);
  debug('client ip %s', ip);

  fakePlayerBatch.subscribe((playerbatch) => {
    socket.emit('mappy:playerbatch', playerbatch);
  });
});
