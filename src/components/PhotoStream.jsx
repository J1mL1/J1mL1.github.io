// Import necessary dependencies
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useStore } from '@nanostores/react'; 
import { currentGroup } from '../stores/photoStore';
import Photo from './Photo';
import Lightbox from './Lightbox';
import LazyLoad from 'vanilla-lazyload';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import photoData from '../data/photos.json';

// Process and sort all photos by date in descending order
const allPhotos = Object.values(photoData.photoGroups)
  .flat()
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const PhotoStream = () => {
  // Initialize state and refs
  const [photos, setPhotos] = useState(allPhotos);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [masonryInitialized, setMasonryInitialized] = useState(false);
  const [containerReady, setContainerReady] = useState(false);
  const group = useStore(currentGroup);
  const lazyLoadInstanceRef = useRef(null);
  const masonryRef = useRef(null);
  const gridRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const initTimeoutRef = useRef(null);

  // Handle photo group changes
  useEffect(() => {
    console.log('Group changed:', group);
    if (group) {
      setPhotos(photoData.photoGroups[group] || []);
    } else {
      setPhotos(allPhotos);
    }
  }, [group]);

  // Initialize lazy loading
  useEffect(() => {
    lazyLoadInstanceRef.current = new LazyLoad({
      elements_selector: '.lazyload',
      threshold: 300,
      data_src: 'src',
    });

    // Cleanup lazy loading instance on unmount
    return () => {
      lazyLoadInstanceRef.current?.destroy();
    };
  }, []);

  // Update lazy loading when photos change
  useEffect(() => {
    lazyLoadInstanceRef.current?.update();
  }, [photos]);

  // Initialize Masonry layout with proper timing
  const initializeMasonry = () => {
    if (!gridRef.current || !containerReady) return;

    if (masonryRef.current) {
      masonryRef.current.destroy();
      masonryRef.current = null;
    }

    // Clear any pending initialization
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    initTimeoutRef.current = setTimeout(() => {
      if (gridRef.current) {
        try {
          masonryRef.current = new Masonry(gridRef.current, {
            itemSelector: '.post',
            columnWidth: '.post',
            percentPosition: true,
            gutter: 10,
            transitionDuration: 0, // Disable transitions for faster layout
          });

          console.log('Masonry initialized:', masonryRef.current);

          // Force immediate layout
          masonryRef.current.layout();

          // Use imagesLoaded for safety
          imagesLoaded(gridRef.current, () => {
            if (masonryRef.current) {
              masonryRef.current.layout();
              console.log('Images loaded, Masonry layout called');
            }
          });

          // Progressive layout calls to catch any timing issues
          const delays = [50, 150, 300, 600, 1000];
          delays.forEach(delay => {
            setTimeout(() => {
              if (masonryRef.current) {
                masonryRef.current.layout();
              }
            }, delay);
          });

          setMasonryInitialized(true);
        } catch (error) {
          console.error('Masonry initialization error:', error);
        }
      }
    }, 100);
  };

  // Set container ready state after component mounts
  useLayoutEffect(() => {
    setContainerReady(true);
  }, []);

  // Initialize Masonry when photos change or container is ready
  useEffect(() => {
    if (containerReady) {
      setMasonryInitialized(false);
      initializeMasonry();
    }

    // Cleanup
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (masonryRef.current) {
        masonryRef.current.destroy();
        masonryRef.current = null;
      }
    };
  }, [photos, containerReady]);

  // Setup ResizeObserver for container changes
  useEffect(() => {
    if (!gridRef.current) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      if (masonryRef.current) {
        masonryRef.current.layout();
      }
    });

    resizeObserverRef.current.observe(gridRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Handle window resize events
  const handleResize = () => {
    if (masonryRef.current) {
      masonryRef.current.layout();
    }
    lazyLoadInstanceRef.current?.update();
  };

  // Add and remove resize event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle photo click events, open lightbox
  const handlePhotoClick = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  // Close lightbox
  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  // Handle individual photo load
  const handlePhotoLoad = () => {
    // Update layout when each image loads
    lazyLoadInstanceRef.current?.update();
    if (masonryRef.current) {
      // Debounce layout calls
      setTimeout(() => {
        if (masonryRef.current) {
          masonryRef.current.layout();
        }
      }, 10);
    }
  };

  // Render photo grid
  return (
      <div className='photo-stream-container'>
        <div className="masonry-grid" ref={gridRef}>
        {photos.map((photo, index) => (
            <div key={`${photo.src}-${photo.date}`} className="post">
              <Photo
                src={photo.src}
                alt={photo.alt}
                caption={photo.caption}
                onLoad={handlePhotoLoad}
                onClick={() => handlePhotoClick(index)}
              />
            </div>
          ))}
        </div>

      {lightboxOpen && (
        <Lightbox
          photos={photos}
          currentIndex={currentPhotoIndex}
          onClose={handleLightboxClose}
        />
      )}
      </div>
  );
};

export default PhotoStream;
