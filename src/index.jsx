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
                       const potential = JSON.parse(data);
                       if (Array.isArray(potential)) {
                         return potential;
                       }
                       throw new Error('Player data not an array');
                     })
                     .retryWhen((attempts) => {
                       return Rx.Observable.range(1, 32)
                                .zip(attempts, i => i)
                                .flatMap(i => {
                                  return Rx.Observable.timer(Math.pow(2, i) * 1000);
                                });
                     })
                     .filter(x => x !== [])
                     .throttle(17) // Little bit under 60fps
                     .distinctUntilChanged();

const WorldMapContainer = withStore(events, 'players')(WorldMap);

ReactDOM.render(
  <WorldMapContainer />, document.querySelector('#app')
);
