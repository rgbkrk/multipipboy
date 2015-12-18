import React from 'react';

export const DEFAULT_PLAYER_SIZE = 2;

const styles = {
  arrow: {
    position: 'absolute',
    display: 'block',
  },
  inner: {
    position: 'absolute',
    display: 'block',
    width: 2,
    height: 2,
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
      size: 2,
    };
  },
  displayStats() {
    console.log(this.props.name);
  },
  render() {
    return (
      <div style={
             Object.assign({}, styles.arrow, {
               left: `${(this.props.x / this.props.mapSize) * 100 }%`,
               top: `${(this.props.y / this.props.mapSize) * 100 }%`,
               transform: `rotate(${this.props.orientation}deg)`,
             })}
           onMouseOver={this.displayStats}>
        <div style={Object.assign({}, styles.inner, {
          backgroundColor: this.props.color,
          width: this.props.size,
          height: this.props.size,
        })}/>
      </div>
    );
  },
});
