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

    ps.set(1, { x: 1, y: 2, color: new Buffer([0xff, 0x00, 0xff, 0x00]) });

    expect(ps.get(1)).to.deep.equal({
      x: 1,
      y: 2,
      color: new Buffer([0xff, 0x00, 0xff, 0x00]),
    });

    expect(ps.playersAt(1, 2)).to.include(1);
  });

  it('handles the case where a player has moved', () => {
    const ps = new PlayerStore(16, 16);
    expect(ps.get(1)).to.be.undefined;

    ps.set(1, { x: 4, y: 6, name: 'Lucky Duck', color: new Buffer([0xff, 0x00, 0xff, 0xff]) });
    expect(ps.get(1)).to.deep.equal({
      x: 4,
      y: 6,
      color: new Buffer([0xff, 0x00, 0xff, 0xff]),
      name: 'Lucky Duck',
    });

    ps.set(1, { x: 10, y: 6, name: 'Lucky Duck', color: new Buffer([0xff, 0x00, 0xff, 0xff]) });
    expect(ps.get(1)).to.deep.equal({
      x: 10,
      y: 6,
      color: new Buffer([0xff, 0x00, 0xff, 0xff]),
      name: 'Lucky Duck',
    });
  });

  it('keeps track of positions across many players', () => {
    const ps = new PlayerStore(2, 2);
    ps.set(1, { x: 0, y: 0, color: new Buffer([0xff, 0x00, 0xff, 0xff]) });
    ps.set(2, { x: 0, y: 0, color: new Buffer([0xff, 0x00, 0xff, 0xff]) });
    expect(ps.playersAt(0, 0)).equal(List.of(1, 2));

    ps.set(1, { x: 1, y: 0, color: new Buffer([0xff, 0x00, 0xff, 0xff]) });
    expect(ps.playersAt(1, 0)).equal(List.of(1));
    expect(ps.playersAt(0, 0)).equal(List.of(2));
  });

  it('keeps the image buffer synced up', () => {
    const ps = new PlayerStore(2, 2);
    ps.set(1, { x: 0, y: 0, color: new Buffer([0x01, 0x02, 0x03, 0xf1]) });
    ps.set(2, { x: 1, y: 0, color: new Buffer([0x05, 0x06, 0x07, 0xf2]) });
    ps.set(3, { x: 0, y: 1, color: new Buffer([0x09, 0x0a, 0x0b, 0xf3]) });
    ps.set(4, { x: 1, y: 1, color: new Buffer([0x0d, 0x0e, 0x0f, 0xf4]) });

    expect(ps.imageBuffer).to.deep.equal(new Buffer([
      0x01, 0x02, 0x03, 0xf1,
      0x05, 0x06, 0x07, 0xf2,
      0x09, 0x0a, 0x0b, 0xf3,
      0x0d, 0x0e, 0x0f, 0xf4,
    ]));

    ps.set(2, { x: 1, y: 0, color: new Buffer([0x05, 0x06, 0x07, 0xf8]) });
    expect(ps.imageBuffer).to.deep.equal(new Buffer([
      0x01, 0x02, 0x03, 0xf1,
      0x05, 0x06, 0x07, 0xf8,
      0x09, 0x0a, 0x0b, 0xf3,
      0x0d, 0x0e, 0x0f, 0xf4,
    ]));

    // NOTE: implicit ordering is .last() within the playerGrid
    ps.set(5, { x: 1, y: 0, color: new Buffer([0xfd, 0xf0, 0xfa, 0xf2]) });
    expect(ps.imageBuffer).to.deep.equal(new Buffer([
      0x01, 0x02, 0x03, 0xf1,
      0xfd, 0xf0, 0xfa, 0xf2,
      0x09, 0x0a, 0x0b, 0xf3,
      0x0d, 0x0e, 0x0f, 0xf4,
    ]));
  });

});
