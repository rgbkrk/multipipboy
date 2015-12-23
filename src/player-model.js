import { List, Map } from 'immutable';

export const DEFAULT_WIDTH = 2048;
export const DEFAULT_HEIGHT = 2048;

export class PlayerStore {
    constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
      this.width = width;
      this.height = height;

      // UID -> Player data
      this.players = new Map();

      // position -> List(uids...)
      this.playerGrid = new Array(this.width * this.height);
      // There's a fun fact in here about .map() on new empty arrays
      for (let i = 0; i < this.playerGrid.length; i++) {
        this.playerGrid[i] = new List();
      }
    }

    index(x, y) {
      return this.width * y + x;
    }

    boundsCheck(x, y) {
      if(x < 0 || y < 0 || x >= this.width || y >= this.height) {
        throw new Error('x or y are out of range of this map');
      }
    }

    set(id, playerData) {
      if(!playerData.hasOwnProperty('x') || !playerData.hasOwnProperty('y')) {
        throw new Error('x and y must be set on player data');
      }
      this.boundsCheck(playerData.x, playerData.y);

      // If we had an old position, remove it from the playerGrid
      // One optimization not done here - if the old position and the new position
      // are the same, don't update either of them
      if (this.players.has(id)) {
        const original = this.players.get(id);
        const pos = this.index(original.x, original.y);
        this.playerGrid[pos] = this.playerGrid[pos].filter(x => x !== id);
      }

      this.players = this.players.set(id, playerData);

      const newPos = this.index(playerData.x, playerData.y);
      this.playerGrid[newPos] = this.playerGrid[newPos].push(id);
    }

    get(id) {
      return this.players.get(id);
    }

    playersAt(x, y) {
      this.boundsCheck(x, y);
      const pos = this.index(x, y);
      return this.playerGrid[pos];
    }

    inspect() {
      return {
        players: this.players,
      };
    }
}
