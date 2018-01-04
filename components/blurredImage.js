import React from 'react';
import jpg from 'jpeg-js';

import ImagePreview from './imagePreview';
import loadWasm from '../rust-filter/src/lib.rs';

class BlurredImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wasm: null,
      loading: true
    };
  }

  componentDidMount() {
    loadWasm({ env: { roundf: Math.round } }).then(result =>
      this.setState({ loading: false, wasm: result.instance.exports })
    );
  }

  render() {
    const { size, data } = this.props;
    const { loading, wasm } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    const decoded = jpg.decode(data);

    const { alloc, dealloc, blur, memory: linearMemory } = wasm;
    const ptr = alloc(decoded.data.length / 4 * 3);

    const memory = new Uint8Array(linearMemory.buffer, ptr);
    for (let i = 0; i < decoded.data.length; i++) {
      if (i % 4 !== 3) {
        // Skip alpha channel
        memory[i - Math.floor(i / 4)] = decoded.data[i];
      }
    }

    const blurredPtr = blur(ptr, decoded.width, decoded.height, size);

    const result = new Uint8Array(
      linearMemory.buffer,
      blurredPtr,
      decoded.data.length / 4 * 3
    );

    const resultWithAlpha = new Uint8Array(decoded.data.length);

    result.forEach((byte, i) => {
      resultWithAlpha[i + Math.floor(i / 3)] = byte;

      if (i % 3 === 2) {
        resultWithAlpha[i + Math.floor(i / 3) + 1] = 255;
      }
    });

    dealloc(ptr, decoded.data.length / 4 * 3);

    const encodedImage = jpg.encode({
      width: decoded.width,
      height: decoded.height,
      data: resultWithAlpha
    }).data;

    return <ImagePreview data={encodedImage} />;
  }
}

export default BlurredImage;
