import React from 'react';
import ReactDOM from 'react-dom';

import Rx from 'rx';
import { DOM } from 'rx-dom';
Rx.DOM = DOM;

import { withStore } from 'fluorine-lib';
import { WorldMap } from './components/WorldMap';

const opener = () => Rx.Observer.create((ev) => { console.log('Opening ', ev); });
const events = Rx.DOM.fromEventSource('http://127.0.0.1:8090', opener())
                     .map(data => {
                       try {
                         const potential = JSON.parse(data);
                         if (Array.isArray(potential)) {
                           return potential;
                         }
                         console.error('Player data not an array');
                       }
                       catch (e) {
                         console.error(e);
                       }
                       return [];
                     })
                     .filter(x => x !== [])
                     .distinctUntilChanged();

const WorldMapContainer = withStore(events, 'players')(WorldMap);

ReactDOM.render(
  <WorldMapContainer />, document.querySelector('#app')
);
