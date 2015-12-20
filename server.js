const http = require('http');

const startingPlayers = [
  { name: 'Daryl Johnson', x: 128, y: 120 },
  { name: 'Lucky Duck', x: 450, y: 520 },
  { name: 'Ayana Smith', x: 1028, y: 200 },
];

function walk(pt) {
  const change = Math.cos(Math.PI * Math.round(Math.random())) // -1 or 1
                 * Math.round(Math.random()); // 0 or 1
  const newPt = pt + change;
  if (newPt < 0 || newPt >= 2048) {
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
});
