import React from 'react';

const MAP_SIZE = 2048;

import { index } from '../player-model';

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
    const pos = index(evt.clientX, evt.clientY);
    const players = this.props.playerGrid[pos];
    players.forEach(playerID => {
      console.log(this.props.players.get(playerID));
    });
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
