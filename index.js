import React from 'react';
import ReactDOM from 'react-dom';
import g from 'glamorous';

import ImageSelector from './components/imageSelector';
import ImagePreview from './components/imagePreview';
import BlurredImage from './components/blurredImage';

const ImageContainer = g.div({
  border: '1px solid #e6e6e6',
  borderRadius: '4px',
  padding: '2em',
  minWidth: '20em',
  maxWidth: '40vw',
  marginBottom: '1em',
  backgroundColor: '#d2f5ff'
});

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
        <g.Div
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom="1em"
        >
          <ImageSelector
            onChange={newImage => {
              this.setState({ image: newImage });
            }}
          />
          <label>
            Blur radius:
            <input
              type="range"
              value={this.state.size}
              min={0}
              max={5}
              onChange={e => this.setState({ size: e.target.value })}
            />
          </label>
        </g.Div>
        <g.Div display="flex" justifyContent="space-around" flexWrap="wrap">
          {this.state.image && (
            <React.Fragment>
              <ImageContainer>
                <ImagePreview data={this.state.image} />
              </ImageContainer>
              <ImageContainer>
                <BlurredImage data={this.state.image} size={this.state.size} />
              </ImageContainer>
            </React.Fragment>
          )}
        </g.Div>
      </div>
    );
  }
}

const mountNode = document.getElementsByTagName('body')[0];
ReactDOM.render(<App />, mountNode);
