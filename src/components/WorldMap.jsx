import React from 'react';

const MAP_SIZE = 2048;

import { index } from '../player-model';

import { List, Range } from 'immutable';

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

  mouseMoved(evt) {
    const rect = this.canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    const delta = 5

    // We'll go out a fixed grid size beyond where the mouse is hovering on
    const centerQuery = index(x, y);
    const yRange = new Range(-delta, delta, 1);
    const positions = yRange.map(_y => {
      const pos = centerQuery + _y * MAP_SIZE;
      return new Range(pos - delta, pos + delta);
    }).flatten();

    const players = positions.flatMap(
      (pos) => {
        return this.props.playerGrid[pos];
      }
    ).flatten().map(id => this.props.players.get(id));

    if (! players.isEmpty()) {
      console.log(players.toArray().map(p => p.name));
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
    return <canvas
            width={MAP_SIZE}
            height={MAP_SIZE}
            ref={(c) => this.canvas = c}
            onMouseMove={this.mouseMoved.bind(this)}
            />;
  }
}
