import React from 'react';
import ReactDOM from 'react-dom';

import connect from './connect';
import { WorldMapStore } from './player-store';
import { PlayerModel } from './player-model';

const batchEvents = connect();
const ps = new PlayerModel();

const playerData = batchEvents.map((playerbatch) => {
  playerbatch.forEach(player => {
    ps.set(player.id, player);
  });
  return {
    players: ps.players,
    playerGrid: ps.playerGrid,
  };
});

ReactDOM.render(
  <WorldMapStore batchEvents={playerData} />, document.querySelector('#app')
);
