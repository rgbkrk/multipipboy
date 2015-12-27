import React from 'react';

const MAP_SIZE = 2048;

import { index } from '../player-model';

import Stats from './Stats';

import { Range } from 'immutable';

export class WorldMap extends React.Component {
  static displayName = 'CanvasWorldMap';

  static propTypes = {
    playerGrid: React.PropTypes.any,
    players: React.PropTypes.any,
  }

  componentDidMount() {
    const image = new Image();
    image.onload = this.loadedImage.bind(this, image);
    image.src = 'CompanionWorldMap.png';
    const context = this.canvas.getContext('2d');
    this.paint(context);
  }

  componentDidUpdate() {
    const context = this.canvas.getContext('2d');

    // We only clear if the map is not shown
    if (! this.state || ! this.state.image) {
      context.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
    }

    this.paint(context);
  }

  loadedImage(image) {
    this.setState({ image });
  }

  mouseMoved(event) {

    const style = document.defaultView.getComputedStyle(this.canvas, null);
    function styleValue(property) {
      return parseInt(style.getPropertyValue(property), 10) || 0;
    }
    const scaleX = this.canvas.width / styleValue('width');
    const scaleY = this.canvas.height / styleValue('height');
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.round(scaleX * (event.clientX - rect.left - this.canvas.clientLeft - styleValue('padding-left')));
    const y = Math.round(scaleY * (event.clientY - rect.top - this.canvas.clientTop - styleValue('padding-top')));

    const delta = 5;

    // We'll go out a fixed grid size beyond where the mouse is hovering on
    const centerQuery = index(x, y);

    const yRange = new Range(-delta, delta, 1);
    const positions = yRange.map(_y => {
      const pos = centerQuery + _y * MAP_SIZE;
      return new Range(pos - delta, pos + delta);
    }).flatten();

    const playerIDs = positions.flatMap(
      (pos) => {
        const posPlayerIDs = this.props.playerGrid[pos];
        return posPlayerIDs;
      }
    ).flatten();

    const players = playerIDs.map(id => this.props.players.get(id));

    if (! players.isEmpty()) {
      this.setState({
        tooltip: {
          player: players.last(),
        },
      });
    }

  }

  paint(context) {
    context.save();
    // Image data
    if (this.state && this.state.image) {
      const image = this.state.image;
      context.globalCompositeOperation = 'source-over';
      context.drawImage(image, 0, 0);
    }

    this.props.players.forEach((player) => {
      context.fillStyle = '#' + player.id.slice(0, 6);
      context.fillRect(player.x, player.y, 2, 2);
    });
    context.restore();
  }

  render() {
    return (
      <div>
      { (this.state && this.state.tooltip) ?
            <Stats
              player={this.state.tooltip.player}
              mapSize={2048}
              left={this.state.tooltip.left}
              top={this.state.tooltip.top}
              /> :
          null
        }
        <canvas
          width={MAP_SIZE}
          height={MAP_SIZE}
          ref={(c) => this.canvas = c}
          onMouseMove={this.mouseMoved.bind(this)}
          />;
      </div>
    );
  }
}
