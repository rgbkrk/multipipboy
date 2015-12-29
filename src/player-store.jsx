import React from 'react';

import { WorldMap } from './components/WorldMap';

export class WorldMapStore extends React.Component {
  static displayName = 'WorldMapContainer'

  static propTypes = {
    batchEvents: React.PropTypes.any,
  }

  constructor(props) {
    super(props);

    this.state = {
      players: null,
      playerGrid: null,
    };
  }

  componentWillMount() {
    this.sub = this.props.batchEvents.subscribe(next => {
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

    return <WorldMap players={this.state.players}
                     playerGrid={this.state.playerGrid} />;
  }
}
