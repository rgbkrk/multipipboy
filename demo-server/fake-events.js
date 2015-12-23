import Rx from 'rx';

const uuid = require('node-uuid');

const mapSize = 2048;
const codsworthNames = require('codsworth-names');
const adjectives = require('./adjectives');

export function newPlayer(name) {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const id = uuid.v4();

  const color = new Buffer(id.slice(0, 3 * 2) + 'ff');
  return {
    id,
    color,
    name: `${adjective} ${name}`,
    x: Math.round(Math.random() * (mapSize - 1)),
    y: Math.round(Math.random() * (mapSize - 1)),
  };
}

// Random walk -1, 0, 1
export function walk(pt) {
  const change = Math.cos(Math.PI * Math.round(Math.random())) // -1 or 1
                 * Math.round(Math.random()); // 0 or 1
  const newPt = pt + change;
  if (newPt < 0 || newPt >= mapSize) {
    return pt;
  }
  return newPt;
}

export function generate() {
  const gameState = {
    players: codsworthNames.map(newPlayer),
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
  return fakeEvents;
}

export function generatePlayerData() {
  const gameState = {
    players: codsworthNames.map(newPlayer),
  };
  const fakeEvents = Rx.Observable.create((observer) => {
    setInterval(() => {
      gameState.players = gameState.players.map(
        player => {
          const ret = Object.assign(player, {
            x: walk(player.x),
            y: walk(player.y),
          });
          observer.onNext(player);
          return ret;
        });
    }, 10);
  });
  return fakeEvents;
}
