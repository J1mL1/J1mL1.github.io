import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

const Lightbox = ({ photos, currentIndex, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [transitionClass, setTransitionClass] = useState('');
  const [preloadedImages, setPreloadedImages] = useState({});
  const lightboxRef = useRef(null);

  // Handle remote image URLs
  const getOptimizedImageUrl = (src) => {
    if (src.startsWith('http') && src.includes('unsplash.com')) {
      return `${src}?w=1200&q=90&auto=format`;  // High quality version for fullscreen viewing
    }
    return src;
  };

  // Preload adjacent images
  const preloadAdjacentImages = useCallback(() => {
    const indicesToLoad = [
      activeIndex - 1,
      activeIndex + 1
    ].filter(idx => idx >= 0 && idx < photos.length);

    indicesToLoad.forEach(idx => {
      if (!preloadedImages[idx]) {
        const img = new Image();
        img.src = getOptimizedImageUrl(photos[idx].src);
        setPreloadedImages(prev => ({
          ...prev,
          [idx]: true
        }));
      }
    });
  }, [activeIndex, photos, preloadedImages]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, photos.length, onClose]);

  // Preload adjacent images
  useEffect(() => {
    preloadAdjacentImages();
  }, [activeIndex, preloadAdjacentImages]);

  // Handle image navigation
  const navigateImage = (direction) => {
    if (direction === 'prev' && activeIndex > 0) {
      setTransitionClass('transition-prev');
      setTimeout(() => setActiveIndex(activeIndex - 1), 50);
    } else if (direction === 'next' && activeIndex < photos.length - 1) {
      setTransitionClass('transition-next');
      setTimeout(() => setActiveIndex(activeIndex + 1), 50);
    }
  };

  // Handle touch events
  const [touchStart, setTouchStart] = useState(null);
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const threshold = 50;

    if (diff > threshold) {
      navigateImage('next');
    } else if (diff < -threshold) {
      navigateImage('prev');
    }
    
    setTouchStart(null);
  };

  // Handle click to close
  const handleOverlayClick = (e) => {
    if (e.target === lightboxRef.current) {
      onClose();
    }
  };

  return (
    <div 
      className={`lightbox-overlay active`}
      ref={lightboxRef}
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="lightbox-container">
        {photos.map((photo, index) => (
          <img
            key={`lightbox-${index}`}
            src={getOptimizedImageUrl(photo.src)}
            alt={photo.alt || 'Image'}
            className={`lightbox-img ${index === activeIndex ? 'active ' + transitionClass : ''}`}
            style={{ display: index === activeIndex ? 'block' : 'none' }}
            referrerPolicy={photo.src.startsWith('http') ? "no-referrer" : ""}
            loading={Math.abs(index - activeIndex) <= 1 ? "eager" : "lazy"}
          />
        ))}
        
        {photos[activeIndex]?.caption && (
          <div className={`lightbox-caption ${activeIndex === currentIndex ? '' : 'active'}`}>
            {photos[activeIndex].caption}
          </div>
        )}
      </div>

      <div className="lightbox-close" onClick={onClose}></div>
      
      <div className="lightbox-navigation">
        <button 
          className={`lightbox-nav-btn lightbox-prev ${activeIndex === 0 ? 'disabled' : ''}`} 
          onClick={() => navigateImage('prev')}
          disabled={activeIndex === 0}
          aria-label="Previous image"
        ></button>
        <button 
          className={`lightbox-nav-btn lightbox-next ${activeIndex === photos.length - 1 ? 'disabled' : ''}`} 
          onClick={() => navigateImage('next')}
          disabled={activeIndex === photos.length - 1}
          aria-label="Next image"
        ></button>
      </div>
    </div>
  );
};

Lightbox.propTypes = {
  photos: PropTypes.array.isRequired,
  currentIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Lightbox; 