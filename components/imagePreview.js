import React from 'react';

function ImagePreview({ data }) {
  var arrayBufferView = new Uint8Array(data);
  var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
  var imageUrl = URL.createObjectURL(blob);

  return <img src={imageUrl} width="100%" />;
}

export default ImagePreview;
