const Rx = require('rx');
const express = require('express');
const uuid = require('node-uuid');
const bodyParser = require('body-parser');

const v1 = function v1() {
  const api = new express.Router();
  const playerStream = new Rx.Subject();

  api.use(bodyParser.json());

  api.all((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    next();
  });

  // Create a new player
  api.post('/player', (req, resp) => {
    // Gives back a UUID, should have a real auth scheme
    resp.json({ id: uuid.v4() });
  });

  api.put('/player/:id', (req, resp) => {
    if (!req.body || !req.is('json')) {
      return resp.status(400).json({
        err: 'Content-Type must be set to application/json',
      });
    }
    const db = req.body;
    if (!db.Map || !db.Map.World || !db.Map.World.Extents ||
        !db.Map.World.Player) {
      return resp.status(400).json({
        err: 'Player data needs Map.World.Extents and Map.World.Player in JSON',
      });
    }
    const player = {};

    player.id = req.params.id;

    const worldMapSize = 2048;
    const worldX = db.Map.World.Player.X;
    const worldY = db.Map.World.Player.X;

    const extentsMinX = db.Map.World.Extents.NWX;
    const extentsMaxX = db.Map.World.Extents.NEX;

    const extentsMinY = db.Map.World.Extents.SWY;
    const extentsMaxY = db.Map.World.Extents.NWY;

    const scaledX = (worldX - extentsMinX) / (extentsMaxX - extentsMinX);
    const scaledY = 1.0 - (worldY - extentsMinY) / (extentsMaxY - extentsMinY);

    player.x = Math.round(scaledX * worldMapSize);
    player.y = Math.round(scaledY * worldMapSize);

    player.name = db.PlayerInfo.PlayerName;

    playerStream.onNext(player);
    resp.sendStatus(200);
  });

  return {
    router: api,
    playerStream,
  };
};

module.exports = {
  v1,
};
