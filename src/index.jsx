import React from 'react';
import ReactDOM from 'react-dom';

import { withStore } from 'fluorine-lib';
import { WorldMap } from './components/WorldMap';

import connect from './connect';

const events = connect('http://127.0.0.1:8090');
const WorldMapContainer = withStore(events, 'imageData')(WorldMap);

ReactDOM.render(
  <WorldMapContainer />, document.querySelector('#app')
);
