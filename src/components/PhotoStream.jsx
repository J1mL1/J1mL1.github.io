// Import necessary dependencies
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react'; 
import { currentGroup } from '../stores/photoStore';
import Photo from './Photo';
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
  const group = useStore(currentGroup);
  const lazyLoadInstanceRef = useRef(null);
  const masonryRef = useRef(null);

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

  // Initialize Masonry layout
  useEffect(() => {
    masonryRef.current = new Masonry('.masonry-grid', {
      itemSelector: '.post',
      columnWidth: '.post',
      percentPosition: true,
      gutter: 10,
    });

    console.log('Masonry initialized:', masonryRef.current);

    // Ensure proper layout after all images are loaded
    imagesLoaded('.masonry-grid', () => {
      masonryRef.current.layout();
      console.log('Images loaded, Masonry layout called');
    });

    // Cleanup Masonry instance on unmount
    return () => {
      if (masonryRef.current) {
        masonryRef.current.destroy();
      }
    };
  }, [photos]);

  // Handle window resize events
  const handleResize = () => {
    masonryRef.current?.layout();
    lazyLoadInstanceRef.current?.update();
  };

  // Add and remove resize event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Render photo grid
  return (
      <div className='photo-stream-container'>
        <div className="masonry-grid">
          {photos.map((photo) => (
            <div key={`${photo.src}-${photo.date}`} className="post">
              <Photo
                src={photo.src}
                alt={photo.alt}
                caption={photo.caption}
                onLoad={() => {
                  // Update layout when each image loads
                  lazyLoadInstanceRef.current?.update();
                  masonryRef.current?.layout();
                }}
              />
            </div>
          ))}
        </div>
      </div>
  );
};

export default PhotoStream;
