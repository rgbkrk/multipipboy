import React from 'react';

const MAP_SIZE = 2048;

export class WorldMap extends React.Component {
  static displayName = 'CanvasWorldMap';

  static propTypes = {
    players: React.PropTypes.array,
    // mapData: React.PropTypes.any,
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
    console.log(evt.clientX, evt.clientY);
  }

  paint(context) {
    context.save();
    // Image data
    if (this.state && this.state.image) {
      const image = this.state.image;
      context.globalCompositeOperation = 'source-over';
      context.drawImage(image, 0, 0);
    }

    this.props.players.map((player) => {
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
            onMouseMove={this.mouseMoved}
            />;
  }
}
