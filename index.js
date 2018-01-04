import React from 'react';
import ReactDOM from 'react-dom';
import jpg from 'jpeg-js';

import loadWasm from './rust-filter/src/lib.rs';
import ImageSelector from './components/imageSelector';
import ImagePreview from './components/imagePreview';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      wasm: null,
      baseImage: null,
      image: null,
      size: 2
    };
  }

  componentDidMount() {
    loadWasm({ env: { pow: Math.pow } }).then(result =>
      this.setState({ loading: false, wasm: result.instance.exports })
    );
  }

  refreshImage() {
    const { baseImage, size } = this.state;
    const decoded = jpg.decode(baseImage);

    const {
      alloc,
      dealloc,
      blur,
      memory: linearMemory
    } = this.state.wasm;
    const ptr = alloc(decoded.data.length);

    const memory = new Uint8Array(linearMemory.buffer, ptr);
    for (let i = 0; i < decoded.data.length; i++) {
      memory[i] = decoded.data[i];
    }

    const blurredPtr = blur(ptr, decoded.width, decoded.height, size);

    const result = new Uint8Array(
      linearMemory.buffer,
      blurredPtr,
      decoded.data.length
    );

    dealloc(ptr, decoded.data.length);

    this.setState({
      image: jpg.encode({
        width: decoded.width,
        height: decoded.height,
        data: result
      }).data
    });
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          'Loading...'
        ) : (
          <React.Fragment>
            <ImageSelector
              onChange={newImage => {
                this.setState({ baseImage: newImage }, () => this.refreshImage());
              }}
            />
            <div>
              <input
                type="number"
                value={this.state.size}
                min={0}
                max={5}
                onChange={e => this.setState({ size: e.target.value }, () => this.refreshImage())}
              />
              {this.state.image && <ImagePreview data={this.state.image} />}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mountNode = document.getElementsByTagName('body')[0];
ReactDOM.render(<App />, mountNode);
