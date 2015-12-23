/* eslint no-undefined: 0 */
import { expect } from 'chai';

import { PlayerStore, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../demo-server/player-model';

describe('PlayerStore', () => {
  it('initializes with a default big empty setup', () => {
    const ps = new PlayerStore();
    expect(ps.playerGrid.length).to.equal(DEFAULT_WIDTH * DEFAULT_HEIGHT);
    expect(ps.players.size).to.equal(0);
  });
  it('accepts new player data and registers locations', () => {
    const ps = new PlayerStore(4, 4);

    expect(ps.lookupPlayer(1)).to.be.undefined;

    ps.set(1, { x: 1, y: 2 });

    expect(ps.lookupPlayer(1)).to.eql({
      x: 1,
      y: 2,
    });
  });
});
