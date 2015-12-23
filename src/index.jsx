import React from 'react';
import ReactDOM from 'react-dom';

import { WorldMapStore } from './player-store';

ReactDOM.render(
  <WorldMapStore />, document.querySelector('#app')
);
