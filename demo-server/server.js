/* eslint no-plusplus: 0 */

import Rx from 'rx';

const debug = require('debug');
const forwarded = require('forwarded-for');
const sio = require('socket.io');

const uuid = require('node-uuid');

const codsworthNames = require('codsworth-names');
const adjectives = require('./adjectives');

const mapSize = 2048;

function newPlayer(name) {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  return {
    name: `${adjective} ${name}`,
    x: Math.round(Math.random() * mapSize),
    y: Math.round(Math.random() * mapSize),
    id: uuid.v4(),
  };
}

// Grab all the names that Codsworth can pronounce, give them an adjective
const startingPlayers = codsworthNames.map(newPlayer);

// Random walk -1, 0, 1
function walk(pt) {
  const change = Math.cos(Math.PI * Math.round(Math.random())) // -1 or 1
                 * Math.round(Math.random()); // 0 or 1
  const newPt = pt + change;
  if (newPt < 0 || newPt >= mapSize) {
    return pt;
  }
  return newPt;
}

const gameState = {
  players: startingPlayers,
};

const fakeEvents = Rx.Observable.create((observer) => {
  setInterval(() => {
    gameState.players = gameState.players.map(
      player => Object.assign(player, {
        x: walk(player.x),
        y: walk(player.y),
      }));
    observer.onNext(gameState.players);
  }, 10);
});

const PORT = process.env.PORT || 8090;
const uid = process.env.MAPPY_SERVER_UID || uuid.v4();
debug('server uid %s', uid);

const io = sio(PORT);
io.on('connection', (socket) => {
  const req = socket.request;
  const ip = forwarded(req, req.headers);
  debug('client ip %s', ip);

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
