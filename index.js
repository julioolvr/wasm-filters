import React from 'react';
import ReactDOM from 'react-dom';

import ImageSelector from './components/imageSelector';
import ImagePreview from './components/imagePreview';
import BlurredImage from './components/blurredImage';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      size: 2
    };
  }

  render() {
    return (
      <div>
        <ImageSelector
          onChange={newImage => {
            this.setState({ image: newImage });
          }}
        />
        <div>
          <input
            type="number"
            value={this.state.size}
            min={0}
            max={5}
            onChange={e => this.setState({ size: e.target.value })}
          />
          {this.state.image && <ImagePreview data={this.state.image} />}
          {this.state.image && (
            <BlurredImage data={this.state.image} size={this.state.size} />
          )}
        </div>
      </div>
    );
  }
}

const mountNode = document.getElementsByTagName('body')[0];
ReactDOM.render(<App />, mountNode);
