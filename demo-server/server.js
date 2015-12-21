const http = require('http');
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
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    id: uuid.v4(),
  };
}

// Grab all the names that Codsworth can pronounce, give them an adjective
const startingPlayers = codsworthNames.map(newPlayer)
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer))
                                      .concat(codsworthNames.map(newPlayer));

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

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  });
  res.write('\n');

  let players = startingPlayers;

  setInterval(() => {
    players = players.map(
      player => Object.assign(player, {
        x: walk(player.x),
        y: walk(player.y),
      })
    );
    res.write(`data: ${JSON.stringify(players)}\n\n`);
  }, 100);
});

const PORT = process.env.PORT || 8090;

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
  console.log('# of players: ', startingPlayers.length);
});
