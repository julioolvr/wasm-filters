import React from 'react';

class ImageSelector extends React.Component {
  onImageChange(input) {
    const reader = new FileReader();
    reader.onload = () => {
      this.props.onChange(reader.result);
    };
    reader.readAsArrayBuffer(input.files[0]);
  }

  render() {
    return <input type="file" onChange={e => this.onImageChange(e.target)} />;
  }
}

export default ImageSelector;
