const uuid = require('node-uuid');

const debug = require('debug');
const forwarded = require('forwarded-for');
const sio = require('socket.io');

import Rx from 'rx';
import { PNG } from 'node-png';

const fakes = require('./fake-events');
const fakeEvents = fakes.generate();
const fakePlayerData = fakes.generatePlayerData();

import { PlayerStore } from './player-model';

const PORT = process.env.PORT || 8090;
const UID = process.env.MAPPY_SERVER_UID || uuid.v4();

const ps = new PlayerStore();

const imagesInFlight = fakePlayerData
  .map((player) => {
    return ps.set(player.id, player);
  })
  .sample(10)
  .map(() => {
    const p = new PNG({ width: ps.width, height: ps.height });
    ps.imageBuffer.copy(p.data);
    return p;
  });

const imageStream = imagesInFlight
  .concatMap((p) => {
    return Rx.Observable
            .create(observer => {
              p.on('data', (data) => {
                observer.onNext(data);
              });
              p.on('end', () => {
                observer.onCompleted();
              });
              p.on('error', err => {
                throw err;
              });
              p.pack();
            })
            .toArray()
            .map(datas => {
              return Buffer.concat(datas);
            });
  });

debug('server uid %s', UID);

const io = sio(PORT);
io.on('connection', (socket) => {
  const req = socket.request;
  const ip = forwarded(req, req.headers);
  debug('client ip %s', ip);

  imageStream.subscribe((data) => {
    socket.emit('mappy:rawdata', data);
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
