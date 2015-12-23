import React from 'react';

const MAP_SIZE = 2048;

export class WorldMap extends React.Component {
  static displayName = 'CanvasWorldMap';

  static propTypes = {
    imageData: React.PropTypes.any,
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
    // console.log(evt.clientX, evt.clientY);
  }

  paint(context) {
    context.save();
    // Image data
    if (this.state && this.state.image) {
      const image = this.state.image;
      context.globalCompositeOperation = 'source-over';
      context.drawImage(image, 0, 0);
    }

    if(this.props.imageData) {
      const img = new Image();
      const blob = new Blob(new Uint8Array(this.props.imageData),
                            { type: 'image/png' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        console.log('looooaded');
        context.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
      };
      img.src = url;
      // context.drawImage(this.props.imageData);
      /* imData = new ImageData()
      const buf8 = new Uint8ClampedArray(this.props.imageData);
      const imageData = context.getImageData(0, 0, MAP_SIZE, MAP_SIZE);
      imageData.data.set(buf8); */
    }

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
