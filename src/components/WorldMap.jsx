import React from 'react';

import Player from './Player';

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
    players: React.PropTypes.any,
  }

  render() {
    return (
      <div width='100%' style={styles.worldMap}>
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
              />
            );
          })
        }
      </div>
    );
  }
}
