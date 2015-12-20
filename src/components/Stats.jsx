import React from 'react';

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
    player: React.PropTypes.object,
  },
  render() {
    console.log(this.props);
    return (
      <div style={
             Object.assign({}, styles.stats, {
               left: `${(this.props.player.x / this.props.mapSize) * 100 }%`,
               top: `${(this.props.player.y / this.props.mapSize) * 100 }%`,
               backgroundColor: this.props.player.color,
               color: 'white', // Should do based on color above
               fontSize: '1em',
               zIndex: 9000,
             })}>
             {this.props.player.name}
      </div>
    );
  },
});
