import { List, Map } from "immutable";

const players = new Map();
const playerCoors = new Array(2048 * 2048).map(() => new List());

function cantorPairing(x, y) {
  return 0.5 * (x + y) * (x + y + 1) + y;
}

class CantorSearch {
  constructor() {
    this.players = new Map();
    this.playerCoors = new Array(2048 * 2048).map(() => new List());
  }

  set(id, data) {
    this.players = this.players.set(id, {
      position: null,
      data
    });
  }
  
  get(id) {
    return this.players.get(id).data;
  }
  
  setPosition(id, _x, _y) {
    const player = this.players.get(id);
  
    const pos = player.position;
    const newPos = cantorPairing(_x, _y);
  
    this.playerCoors[pos] = this.playerCoors[pos].filter(x => x !== id);
    this.playerCoors[newPos] = this.playerCoors[newPos].push(id);
  
    player.position = newPos;
  }

  getPosition(x, y) {
    const pos = cantorPairing(x, y);
    return this.playerCoors[pos];
  }
}
