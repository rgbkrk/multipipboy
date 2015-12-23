import Rx from 'rx';

const io = require('socket.io-client');

/**
 * Creates an observable connected to `url` with multiplayer data from that
 * endpoint if available. Will perform exponential back-off if the connection
 * goes out.
 * @param {string} url - URL of socket.io websocket
 * @return {Observable} - stream of multiplayer data
 */
export default function connect(url) {
  const socketStream = Rx.Observable.create((observer) => {
    const socket = io(url);
    socket.on('connect', () => {
    });

    socket.on('error', (err) => {
      console.error('my error', err);
      observer.onError(err);
    });

    socket.on('mappy:rawdata', (rawdata) => {
      observer.onNext(rawdata);
    });
  });
  return socketStream.retryWhen((attempts) => {
    return Rx.Observable.range(0, 32) // ~100 days in total is fine for everyone
      .zip(attempts, i => i)
      .flatMap(i => {
        return Rx.Observable.timer(Math.pow(2, i) * 1000);
      });
  })
  // Assume we want to only propagate data at ~60fps
  .throttle(16)
  .distinctUntilChanged();
}
