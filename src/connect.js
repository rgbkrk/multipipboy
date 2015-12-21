import Rx from 'rx';
import { DOM } from 'rx-dom';
Rx.DOM = DOM;

export default function connect(url) {
  return Rx.DOM
    .fromEventSource(url)
    // Parse the data if possible
    .map(data => {
      try {
        const potential = JSON.parse(data);
        if (Array.isArray(potential)) {
          return potential;
        }
      }
      catch(e) {
        console.error('Malformed data from server');
      }
      return [];
    })
    // Exponential back-off
    .retryWhen((attempts) => {
      return Rx.Observable.range(1, 32) // ~100 days in total is fine for everyone
        .zip(attempts, i => i)
        .flatMap(i => {
          return Rx.Observable.timer(Math.pow(2, i) * 1000);
        });
    })
    // Ignore updates with nothing as well as our handled errors above
    .filter(x => x !== [])
    // Assume we want to only propagate data at ~60fps
    .throttle(16)
    .distinctUntilChanged();
}
