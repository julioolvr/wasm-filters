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
    loadWasm({ env: { pow: Math.pow } }).then(result =>
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

    const encodedImage = jpg.encode({
      width: decoded.width,
      height: decoded.height,
      data: result
    }).data;

    return <ImagePreview data={encodedImage} />;
  }
}

export default BlurredImage;
