import React from 'react';
import ReactDOM from 'react-dom';

import observePlayerBatches from './observables/player-batches';
import { WorldMapStore } from './player-store';
import { PlayerModel } from './player-model';

const playerModel = new PlayerModel();
const playerBatches = observePlayerBatches();

const playerStream = playerBatches.map(playerModel.batchUpdate.bind(playerModel));

ReactDOM.render(
  <WorldMapStore playerStream={playerStream} />, document.querySelector('#app')
);
