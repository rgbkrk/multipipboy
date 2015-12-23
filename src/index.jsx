import React from 'react';
import ReactDOM from 'react-dom';

import { withStore } from 'fluorine-lib';
import { WorldMap } from './components/WorldMap';

import connect from './connect';

const batchEvents = connect('http://127.0.0.1:8090');

import { PlayerModel } from './player-model';

const ps = new PlayerModel();
const playerStore = batchEvents.map((playerbatch) => {
  playerbatch.forEach(player => {
    ps.set(player.id, player);
  });
  return {
    players: ps.players,
    playerGrid: ps.playerGrid,
  };
});

const players = playerStore.map(state => state.players);
// const playerGrid = playerStore.map(state => state.playerGrid);

const WorldMapContainer = withStore(players, 'players')(WorldMap);

ReactDOM.render(
  <WorldMapContainer />, document.querySelector('#app')
);
