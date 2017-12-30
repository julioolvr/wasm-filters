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
      image: null
    };
  }

  componentDidMount() {
    loadWasm().then(result =>
      this.setState({ loading: false, wasm: result.instance.exports })
    );
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
                const decoded = jpg.decode(newImage);

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

                const blurredPtr = blur(ptr, decoded.width, decoded.height);

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
              }}
            />
            <div>
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
