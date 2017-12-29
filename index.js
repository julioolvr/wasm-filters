import React from 'react';
import ReactDOM from 'react-dom';

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
              onChange={newImage => this.setState({ image: newImage })}
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
