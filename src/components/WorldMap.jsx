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

export const WorldMap = React.createClass({
  displayName: 'WorldMap',
  render() {
    return (
      <div width='100%' style={styles.worldMap}>
        <img
          ref='worldmap'
          src='CompanionWorldMap.png'
          style={styles.worldMapImage}
          alt='World Map'
        />
        <Player color='#00ff00'
                x={2000}
                y={2000}
                mapSize={2048}
                />
      </div>
    );
  },
});
