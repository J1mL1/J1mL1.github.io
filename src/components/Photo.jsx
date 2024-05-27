import React from 'react';

const Photo = ({ src, alt, caption, onLoad, loading}) => (
    <>
    <img
      data-src={src}
      alt={alt}
      className={`lazyload`}
      onLoad={onLoad}
      loading={loading}
    />
    <div className="overlay">{caption}</div>
    </>
);

export default Photo;