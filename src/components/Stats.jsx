import React from 'react';

import Color from 'color';

const styles = {
  stats: {
    position: 'absolute',
    display: 'block',
  },
};

export default React.createClass({
  displayName: 'Stats',
  propTypes: {
    mapSize: React.PropTypes.number,
    player: React.PropTypes.any,
  },
  render() {
    const player = this.props.player;
    const playerColor = '#' + player.id.slice(0, 6);
    const fontColor = new Color(playerColor).dark() ? 'white' : 'black';

    return (
      <div style={
             Object.assign({}, styles.stats, {
               left: `${player.x}px`,
               top: `${player.y}px`,
               backgroundColor: playerColor,
               color: fontColor,
               fontSize: '1em',
               zIndex: 9000,
             })}>
             <h3 style={{
               paddingLeft: '15px',
               paddingRight: '15px',
             }}>{this.props.player.name}</h3>
      </div>
    );
  },
});
