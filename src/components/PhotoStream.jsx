import React, { useEffect , useRef, useState} from 'react';
import Photo from './Photo';
import LazyLoad from 'vanilla-lazyload';

const initialPhotos = [
  { src: '/lotus/DSCF6440_1.jpg', alt: 'Photo 1', caption: 'Photo 1' },
  { src: '/lotus/DSCF6442_1.jpg', alt: 'Photo 2', caption: 'Photo 2' },
  { src: '/lotus/DSCF6442_1.jpg', alt: 'Photo 3', caption: 'Photo 3' },
  { src: '/lotus/DSCF6607.jpg', alt: 'Photo 4', caption: 'Photo 4' },
  { src: '/lotus/DSCF6440_1.jpg', alt: 'Photo 6', caption: 'Photo 6' },
  { src: '/lotus/DSCF6571.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/lotus/DSCF6571.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/lotus/DSCF6571.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/lotus/DSCF6571.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/lotus/DSCF6489.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/lotus/DSCF6489.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/lotus/DSCF6571.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/lotus/DSCF6571.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/lotus/DSCF6571.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6489.jpg', alt: 'Photo 1111', caption: 'Photo 7' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 1111', caption: 'Photo 8' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 1111', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },
  { src: '/public/lotus/DSCF6440_1.jpg', alt: 'Photo 9', caption: 'Photo 9' },

];

const PhotoStream = () => {
  const containerRef = useRef(null);
  const [photos, setPhotos] = useState(initialPhotos);
  const [isNarrow, setIsNarrow] = useState(false);

  const checkMedia = () => {
    setIsNarrow(window.matchMedia("(max-width:460px)").matches);
  };

  const updateJustified = () => {
    checkMedia();
    const items = containerRef.current.querySelectorAll(".post");

    if (isNarrow) {
      items.forEach((item) => {
        item.removeAttribute("style");
      });
    } else {
      const rowRatio = Number(
        getComputedStyle(containerRef.current).getPropertyValue("--justified-row-ratio")
      );
      const rowHeight = window.innerHeight * rowRatio;

      items.forEach((item) => {
        const image = item.querySelector("img");
        const ratio = image.naturalWidth / image.naturalHeight;
        item.style.width = rowHeight * ratio + "px";
        item.style.flexGrow = ratio;
      });
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      updateJustified();
      window.addEventListener('resize', updateJustified);
    }

    let lazyLoadInstance;
    if (typeof window !== "undefined") {
      lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazyload",
      });
    }

    return () => {
      window.removeEventListener('resize', updateJustified);
      if (lazyLoadInstance) {
        lazyLoadInstance.destroy();
      }
    };
  }, [photos, isNarrow]);

  return (
  <ol ref={containerRef} className="grid justified" reversed>
      {photos.map((photo, index) => (
         <li key={index} className="post">
          <Photo 
            src={photo.src} 
            alt={photo.alt} 
            caption={photo.caption}
            loading={index < 10 ? 'eager' : 'lazy'} // 前三张图片用eager，其他用lazy
            onLoad={updateJustified}
          />
        </li>
      ))}
    </ol>
  );
};

export default PhotoStream;