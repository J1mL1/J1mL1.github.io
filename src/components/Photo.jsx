import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Photo = ({ src, alt, caption, onLoad, onSize }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [dimensions, setDimensions] = useState(null);

  const aspectRatio = dimensions?.width && dimensions?.height
    ? `${dimensions.width}/${dimensions.height}`
    : '4/3';

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setDimensions({ width: naturalWidth, height: naturalHeight });
    setImageLoading(false);
    console.log('Image loaded:', src);
    onLoad?.();
    onSize?.(naturalWidth, naturalHeight);
  };

  const handleError = () => {
    setImageLoading(false);
    console.error('Error loading image:', src);
  };

  return (
    <figure
      className={`photo-wrapper ${!imageLoading ? 'loaded' : ''}`}
      style={{ aspectRatio }}
    >
      {imageLoading && (
        <div className="photo-loading" style={{ aspectRatio }}>
          <div className="spinner" />
        </div>
      )}
      <img
        className={`lazyload photo-img ${!imageLoading ? 'loaded' : ''}`}
        data-src={src}
        alt={alt || 'Photo'}
        onLoad={handleLoad}
        onError={handleError}
      />
      {caption && (
        <figcaption className="photo-caption">{caption}</figcaption>
      )}
    </figure>
  );
};

Photo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  caption: PropTypes.string,
  onLoad: PropTypes.func,
  onSize: PropTypes.func,
};

export default Photo;