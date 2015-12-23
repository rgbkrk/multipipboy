/* eslint no-undefined: 0 */
import { expect } from 'chai';

import { List } from 'immutable';

import { PlayerModel, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../src/player-model';

describe('PlayerModel', () => {
  it('initializes with a default big empty setup', () => {
    const ps = new PlayerModel();
    expect(ps.playerGrid.length).to.equal(DEFAULT_WIDTH * DEFAULT_HEIGHT);
    expect(ps.players.size).to.equal(0);
  });

  it('accepts new player data and registers locations', () => {
    const ps = new PlayerModel(4, 4);

    expect(ps.get(1)).to.be.undefined;
    expect(ps.playersAt(1, 2)).not.to.include(1);

    ps.set(1, { x: 1, y: 2 });

    expect(ps.get(1)).to.eql({
      x: 1,
      y: 2,
    });

    expect(ps.playersAt(1, 2)).to.include(1);
  });

  it('handles the case where a player has moved', () => {
    const ps = new PlayerModel(16, 16);
    expect(ps.get(1)).to.be.undefined;

    ps.set(1, { x: 4, y: 6, name: 'Lucky Duck' });
    expect(ps.get(1)).to.eql({
      x: 4,
      y: 6,
      name: 'Lucky Duck',
    });

    ps.set(1, { x: 10, y: 6, name: 'Lucky Duck' });
    expect(ps.get(1)).to.eql({
      x: 10,
      y: 6,
      name: 'Lucky Duck',
    });
  });

  it('keeps track of positions across many players', () => {
    const ps = new PlayerModel(2, 2);
    ps.set(1, { x: 0, y: 0 });
    ps.set(2, { x: 0, y: 0 });
    expect(ps.playersAt(0, 0)).equal(List.of(1, 2));

    ps.set(1, { x: 1, y: 0 });
    expect(ps.playersAt(1, 0)).equal(List.of(1));
    expect(ps.playersAt(0, 0)).equal(List.of(2));
  });
});
