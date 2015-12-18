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
    /* height: '100%',
    width: '100%', */
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
                x={970}
                y={170}
                mapSize={2048}
                />
        <Player color='#ff0000'
                x={960}
                y={173}
                mapSize={2048}
                />
      </div>
    );
  },
});
