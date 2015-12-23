import Rx from 'rx';

const PNG = require('node-png').PNG;
const uuid = require('node-uuid');

const mapSize = 2048;
const codsworthNames = require('codsworth-names');
const adjectives = require('./adjectives');

export function newPlayer(name) {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  return {
    name: `${adjective} ${name}`,
    x: Math.round(Math.random() * mapSize),
    y: Math.round(Math.random() * mapSize),
    id: uuid.v4(),
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

export function generateImage() {
  // In comes new player positions

  // We take in all the player data at once
  // and form a

  // var idx = (mapSize * y + x) << 2;
  // idx + 0 <- red
  // idx + 1 <- green
  // idx + 2 <- blue
  // idx + 3 <- alpha

  // Assume p.data is a fresh image for this tick?
  // let pixelPos = (mapSize * player.y + player.x) << 2;
  // player.color.copy(p.data, pixelPos)

  // Out goes a new map

  // Bad representation would leave the previous pixels

  var subject = new Rx.Subject();

  var p = new PNG({width: 2048, height: 2048});
  // Set p.data

}
