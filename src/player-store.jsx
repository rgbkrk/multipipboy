import React from 'react';

import connect from './connect';

import { WorldMap } from './components/WorldMap';
import { PlayerModel } from './player-model';

export const WorldMapStore = createWorldMapStore();

export function createWorldMapStore() {
  const batchEvents = connect();
  const ps = new PlayerModel();

  const playerData = batchEvents.map((playerbatch) => {
    playerbatch.forEach(player => {
      ps.set(player.id, player);
    });
    return {
      players: ps.players,
      playerGrid: ps.playerGrid,
    };
  });

  return class WorldMapContainer extends React.Component {
    static displayName = 'WorldMapContainer'
    constructor(props) {
      super(props);

      this.playerModel = playerData;

      this.state = {
        players: null,
        playerGrid: null,
      };
    }

    componentWillMount() {
      this.sub = this.playerModel.subscribe(next => {
        this.setState({
          players: next.players,
          playerGrid: next.playerGrid,
        });
      }, err => {
        throw err;
      });
    }

    componentWillUnmount() {
      this.sub.dispose();
    }

    render() {
      if (this.state.players === null) {
        return null;
      }

      const props = {};
      props.players = this.state.players;
      props.playerGrid = this.state.playerGrid;
      return <WorldMap players={this.state.players}
                       playerGrid={this.state.playerGrid} />;
    }
  };
}
