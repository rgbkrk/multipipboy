import React from 'react';
import ReactDOM from 'react-dom';

import observePlayerBatches from './observables/player-batches';
import { WorldMapStore } from './player-store';
import { PlayerModel } from './player-model';

const playerBatches = observePlayerBatches();
const ps = new PlayerModel();

const playerData = playerBatches.map((playerbatch) => {
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
