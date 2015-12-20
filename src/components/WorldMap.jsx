import React from 'react';

import Player from './Player';
import Stats from './Stats';

const styles = {
  worldMap: {
    display: 'block',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  worldMapImage: {
    height: '100%',
    width: '100%',
    zIndex: -1,
  },
};

export class WorldMap extends React.Component {
  static displayName = 'WorldMap';

  static propTypes = {
    players: React.PropTypes.array,
  }

  playerHovered(player) {
    this.setState({
      hoveredPlayer: player,
    });
  }

  render() {
    return (
      <div width='100%' style={styles.worldMap}>
        { (this.state && this.state.hoveredPlayer) ?
            <Stats
              player={this.state.hoveredPlayer}
              mapSize={2048}
              /> :
          null
        }
        <img
          ref='worldmap'
          src='CompanionWorldMap.png'
          style={styles.worldMapImage}
          alt='World Map'
        />
        {
          this.props.players.map((player) => {
            return (
              <Player name={player.name}
                      color={player.color}
                      x={player.x}
                      y={player.y}
                      mapSize={2048}
                      key={player.id}
                      onMouseOver={this.playerHovered.bind(this, player)}
              />
            );
          })
        }
      </div>
    );
  }
}
