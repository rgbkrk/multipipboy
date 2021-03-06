const Rx = require('rx');
const uuid = require('node-uuid');

const mapSize = 2048;
const codsworthNames = require('codsworth-names');
const adjectives = require('./adjectives');

function newPlayer(name) {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  return {
    name: `${adjective} ${name}`,
    x: Math.round(Math.random() * (mapSize - 1)),
    y: Math.round(Math.random() * (mapSize - 1)),
    id: uuid.v4(),
  };
}

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

function generatePlayerData() {
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

module.exports = {
  generatePlayerData,
};
