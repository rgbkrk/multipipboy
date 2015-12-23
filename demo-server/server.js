const uuid = require('node-uuid');

const debug = require('debug');
const forwarded = require('forwarded-for');
const sio = require('socket.io');

const fakes = require('./fake-events');
const fakeEvents = fakes.generate();

const fakePlayerBatch = fakes.generatePlayerData()
  .bufferWithTime(10);

const PORT = process.env.PORT || 8090;
const UID = process.env.MAPPY_SERVER_UID || uuid.v4();

debug('server uid %s', UID);

const io = sio(PORT);
io.on('connection', (socket) => {
  const req = socket.request;
  const ip = forwarded(req, req.headers);
  debug('client ip %s', ip);

  fakePlayerBatch.subscribe((playerbatch) => {
    socket.emit('mappy:playerbatch', playerbatch);
  });

  fakeEvents.subscribe((data) => {
    socket.emit('mappy:data', data);
  },
  (err) => {
    console.error(err);
  },
  () => {
    console.log('events closed');
  });
});
