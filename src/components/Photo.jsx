import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Photo = ({ src, alt, caption, onLoad, onSize, onClick }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [dimensions, setDimensions] = useState(null);

  // Check if it's a remote image
  const isRemoteImage = src.startsWith('http');

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

  const handleClick = () => {
    if (!imageLoading && onClick) {
      onClick();
    }
  };

  // Add size parameters for Unsplash images to optimize loading
  const optimizedSrc = isRemoteImage && src.includes('unsplash.com') 
    ? `${src}?w=800&q=80&auto=format` 
    : src;

  return (
    <figure
      className={`photo-wrapper ${!imageLoading ? 'loaded' : ''} ${isRemoteImage ? 'remote-image' : ''}`}
      style={{ aspectRatio }}
      onClick={handleClick}
    >
      {imageLoading && (
        <div className="photo-loading" style={{ aspectRatio }}>
          <div className="spinner" />
        </div>
      )}
      <img
        className={`lazyload photo-img ${!imageLoading ? 'loaded' : ''}`}
        data-src={optimizedSrc}
        alt={alt || 'Photo'}
        onLoad={handleLoad}
        onError={handleError}
        referrerPolicy={isRemoteImage ? "no-referrer" : ""}
        loading="lazy"
        decoding="async"
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
  onClick: PropTypes.func
};

export default Photo;