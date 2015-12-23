/* eslint no-undefined: 0 */
import { expect } from 'chai';

import { List } from 'immutable';

import { PlayerStore, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../demo-server/player-model';

describe('PlayerStore', () => {
  it('initializes with a default big empty setup', () => {
    const ps = new PlayerStore();
    expect(ps.playerGrid.length).to.equal(DEFAULT_WIDTH * DEFAULT_HEIGHT);
    expect(ps.players.size).to.equal(0);
  });

  it('accepts new player data and registers locations', () => {
    const ps = new PlayerStore(4, 4);

    expect(ps.get(1)).to.be.undefined;
    expect(ps.playersAt(1, 2)).not.to.include(1);

    ps.set(1, { x: 1, y: 2, color: new Buffer(0xff, 0x00, 0xff, 0x00) });

    expect(ps.get(1)).to.eql({
      x: 1,
      y: 2,
      color: new Buffer(0xff, 0x00, 0xff, 0x00),
    });

    expect(ps.playersAt(1, 2)).to.include(1);
  });

  it('handles the case where a player has moved', () => {
    const ps = new PlayerStore(16, 16);
    expect(ps.get(1)).to.be.undefined;

    ps.set(1, { x: 4, y: 6, name: 'Lucky Duck', color: new Buffer(0xff, 0x00, 0xff, 0x00) });
    expect(ps.get(1)).to.eql({
      x: 4,
      y: 6,
      color: new Buffer(0xff, 0x00, 0xff, 0x00),
      name: 'Lucky Duck',
    });

    ps.set(1, { x: 10, y: 6, name: 'Lucky Duck', color: new Buffer(0xff, 0x00, 0xff, 0x00) });
    expect(ps.get(1)).to.eql({
      x: 10,
      y: 6,
      color: new Buffer(0xff, 0x00, 0xff, 0x00),
      name: 'Lucky Duck',
    });
  });

  it('keeps track of positions across many players', () => {
    const ps = new PlayerStore(2, 2);
    ps.set(1, { x: 0, y: 0, color: new Buffer(0xff, 0x00, 0xff, 0x00) });
    ps.set(2, { x: 0, y: 0, color: new Buffer(0xff, 0x00, 0xff, 0x00) });
    expect(ps.playersAt(0, 0)).equal(List.of(1, 2));

    ps.set(1, { x: 1, y: 0, color: new Buffer(0xff, 0x00, 0xff, 0x00) });
    expect(ps.playersAt(1, 0)).equal(List.of(1));
    expect(ps.playersAt(0, 0)).equal(List.of(2));
  });
});
