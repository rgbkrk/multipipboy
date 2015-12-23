/* eslint no-bitwise: 0 */

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

      // This can be the actual underlying map later
      this.blankSpace = new Buffer(this.playerGrid.length * 4).fill(0);
      // Quite mutable, must track accordingly
      this.imageBuffer = new Buffer(this.playerGrid.length * 4);
      // Copying over for the case of when we have original imageData
      this.blankSpace.copy(this.imageBuffer);
    }

    index(x, y) {
      return this.width * y + x;
    }

    boundsCheck(x, y) {
      if(x < 0 || y < 0 || x >= this.width || y >= this.height) {
        throw new Error('x or y are out of range of this map');
      }
    }

    updateColor(x, y) {
      const pos = this.index(x, y);
      const pixelPos = pos << 2;

      let color = this.blankSpace.slice(pixelPos, pixelPos + 4);
      const players = this.playerGrid[pos];
      if(!players.isEmpty()) {
        // We'll use who's on top (?) for the color here
        color = this.get(players.last()).color;
      }
      color.copy(this.imageBuffer, pixelPos, 0);
    }

    set(id, playerData) {
      if(!playerData.hasOwnProperty('x') || !playerData.hasOwnProperty('y')) {
        throw new Error('x and y must be set on player data');
      }
      this.boundsCheck(playerData.x, playerData.y);

      // If we had an old position, remove it from the playerGrid
      // One optimization not done here - if the old position and the new position
      // are the same, don't update either of them. If that optimization is
      // brought in though, playerData.color should be considered on the imageBuffer
      if (this.players.has(id)) {
        const original = this.players.get(id);
        const pos = this.index(original.x, original.y);
        this.playerGrid[pos] = this.playerGrid[pos].filter(x => x !== id);
        this.updateColor(original.x, original.y);
      }

      this.players = this.players.set(id, playerData);

      const newPos = this.index(playerData.x, playerData.y);
      this.playerGrid[newPos] = this.playerGrid[newPos].push(id);
      this.updateColor(playerData.x, playerData.y);
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
