const Rx = require('rx');
const express = require('express');
const uuid = require('node-uuid');
const bodyParser = require('body-parser');

const v1 = function v1() {
  const api = new express.Router();
  const playerStream = new Rx.BehaviorSubject();

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
    const player = req.body;
    if (!player.name || !player.x || !player.y) {
      return resp.status(400).json({
        err: 'Player data needs name, x, and y in JSON',
      });
    }
    playerStream.onNext(req.body);
    resp.sendStatus(200);
  });

  return api;
};

module.exports = {
  v1,
};
