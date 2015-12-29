import Rx from 'rx';

const io = require('socket.io-client');

/**
 * Creates an observable connected to `location.href` with multiplayer data from that
 * endpoint if available. Will perform exponential back-off if the connection
 * goes out.
 * @return {Observable} - stream of multiplayer data
 */
export default function observePlayerBatches() {

  const mainStream = Rx.Observable.create((observer) => {
    const socket = io();
    socket.on('connect', () => {
      observer.onNext(socket);
    });
    socket.on('error', (err) => {
      observer.onError(err);
    });
  })
  .retryWhen((attempts) => {
    return Rx.Observable.range(0, 32) // ~100 days in total is fine for everyone
      .zip(attempts, i => i)
      .flatMap(i => {
        return Rx.Observable.timer(Math.pow(2, i) * 1000);
      });
  });

  return mainStream
    .flatMap(socket => {
      return Rx.Observable.fromEvent(socket, 'mappy:playerbatch');
    })
    .filter(x => x !== [])
    .throttle(16)
    .distinctUntilChanged();
}
