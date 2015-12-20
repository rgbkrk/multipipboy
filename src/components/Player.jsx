import React from 'react';

const DEFAULT_PLAYER_SIZE = 6;

const styles = {
  dot: {
    position: 'absolute',
    display: 'block',
  },
};

export default React.createClass({
  displayName: 'Player',
  propTypes: {
    color: React.PropTypes.string,
    mapSize: React.PropTypes.number,
    name: React.PropTypes.string,
    orientation: React.PropTypes.number,
    size: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  },
  getDefaultProps() {
    return {
      color: '#00ff00',
      name: 'Unnamed Player',
      orientation: 0,
      x: 0,
      y: 0,
      mapSize: 2048,
      size: DEFAULT_PLAYER_SIZE,
    };
  },
  render() {
    return (
      <div style={
             Object.assign({}, styles.dot, {
               left: `${(this.props.x / this.props.mapSize) * 100 }%`,
               top: `${(this.props.y / this.props.mapSize) * 100 }%`,
               transform: `rotate(${this.props.orientation}deg)`,
               width: this.props.size,
               height: this.props.size,
               backgroundColor: this.props.color,
             })}>
      </div>
    );
  },
});
