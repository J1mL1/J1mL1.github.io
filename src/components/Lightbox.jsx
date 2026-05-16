import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import exifr from 'exifr';

const Lightbox = ({ photos, currentIndex, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [transitionClass, setTransitionClass] = useState('');
  const [preloadedImages, setPreloadedImages] = useState({});
  const [metadataVisible, setMetadataVisible] = useState(false);
  const [currentMetadata, setCurrentMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const lightboxRef = useRef(null);

  // Handle remote image URLs
  const getOptimizedImageUrl = (src) => {
    if (src.startsWith('http') && src.includes('unsplash.com')) {
      return `${src}?w=1200&q=90&auto=format`;  // High quality version for fullscreen viewing
    }
    return src;
  };

  // Extract EXIF data from image using exifr
  const extractMetadata = useCallback(async (imageSrc) => {
    setLoadingMetadata(true);
    setCurrentMetadata(null);
    
    // Skip metadata extraction for external images
    if (imageSrc.startsWith('http')) {
      setCurrentMetadata({
        error: '外部图片无法读取EXIF数据'
      });
      setLoadingMetadata(false);
      return;
    }

    try {
      // Read EXIF data using exifr
      const exifData = await exifr.parse(imageSrc, {
        tiff: true,
        exif: true,
        gps: true,
        icc: false,
        iptc: false,
        xmp: false,
        jfif: false,
        ihdr: false
      });

      if (!exifData) {
        setCurrentMetadata({
          error: '此图片不包含EXIF数据'
        });
        setLoadingMetadata(false);
        return;
      }

      // Format the metadata
      const formattedData = {
        camera: exifData.Make && exifData.Model ? 
          `${exifData.Make} ${exifData.Model}` : '未知相机',
        lens: exifData.LensModel || exifData.LensInfo || exifData.LensMake || '未知镜头',
        aperture: exifData.FNumber ? `f/${exifData.FNumber}` : '未知',
        shutterSpeed: exifData.ExposureTime ? 
          (exifData.ExposureTime < 1 ? 
            `1/${Math.round(1/exifData.ExposureTime)}s` : 
            `${exifData.ExposureTime}s`) : '未知',
        iso: exifData.ISO || exifData.ISOSpeedRatings || '未知',
        focalLength: exifData.FocalLength ? `${exifData.FocalLength}mm` : '未知',
        dateTime: (() => {
          const date = exifData.DateTimeOriginal || exifData.DateTime || exifData.CreateDate;
          if (!date) return '未知日期';
          if (date instanceof Date) {
            return date.toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
          }
          return String(date);
        })(),
        exposureMode: exifData.ExposureMode || '未知',
        exposureBias: exifData.ExposureCompensation ? `${exifData.ExposureCompensation} EV` : '0 EV',
        whiteBalance: exifData.WhiteBalance || '未知',
        flash: exifData.Flash !== undefined ? 
          (exifData.Flash === 0 ? '未闪光' : '已闪光') : '未知',
        imageSize: exifData.ImageWidth && exifData.ImageHeight ? 
          `${exifData.ImageWidth} × ${exifData.ImageHeight}` : '未知尺寸',
        orientation: exifData.Orientation || '未知',
        software: exifData.Software || '未知软件',
        gpsLocation: exifData.latitude && exifData.longitude ? 
          `${exifData.latitude.toFixed(6)}, ${exifData.longitude.toFixed(6)}` : '无位置信息'
      };
      
      setCurrentMetadata(formattedData);
      setLoadingMetadata(false);
    } catch (error) {
      console.error('Error reading EXIF data:', error);
      setCurrentMetadata({
        error: '无法读取图片EXIF数据'
      });
      setLoadingMetadata(false);
    }
  }, []);

  // Load metadata when active image changes
  useEffect(() => {
    if (photos[activeIndex]) {
      const imageSrc = getOptimizedImageUrl(photos[activeIndex].src);
      extractMetadata(imageSrc);
    }
  }, [activeIndex, photos, extractMetadata]);

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
        case 'i':
        case 'I':
          setMetadataVisible(!metadataVisible);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, photos.length, onClose, metadataVisible]);

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

  // Toggle metadata visibility
  const toggleMetadata = () => {
    setMetadataVisible(!metadataVisible);
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

      {/* Metadata Panel */}
      <div className={`lightbox-metadata ${metadataVisible ? 'visible' : ''}`}>
        <div className="metadata-header">
          <h3>📷 图片信息</h3>
          <button className="metadata-close" onClick={toggleMetadata}>×</button>
        </div>
        
        <div className="metadata-content">
          {loadingMetadata ? (
            <div className="metadata-loading">
              <div className="spinner-small"></div>
              <span>读取EXIF数据...</span>
            </div>
          ) : currentMetadata?.error ? (
            <div className="metadata-error">
              <span>⚠️ {currentMetadata.error}</span>
            </div>
          ) : currentMetadata ? (
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="metadata-label">📷 相机</span>
                <span className="metadata-value">{currentMetadata.camera}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">🔍 镜头</span>
                <span className="metadata-value">{currentMetadata.lens}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">🕳️ 光圈</span>
                <span className="metadata-value">{currentMetadata.aperture}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">⚡ 快门</span>
                <span className="metadata-value">{currentMetadata.shutterSpeed}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">🎞️ ISO</span>
                <span className="metadata-value">{currentMetadata.iso}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">📏 焦距</span>
                <span className="metadata-value">{currentMetadata.focalLength}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">💡 曝光补偿</span>
                <span className="metadata-value">{currentMetadata.exposureBias}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">📅 拍摄时间</span>
                <span className="metadata-value">{currentMetadata.dateTime}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">📐 尺寸</span>
                <span className="metadata-value">{currentMetadata.imageSize}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">🔆 闪光灯</span>
                <span className="metadata-value">{currentMetadata.flash}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">📍 GPS位置</span>
                <span className="metadata-value">{currentMetadata.gpsLocation}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">💻 软件</span>
                <span className="metadata-value">{currentMetadata.software}</span>
              </div>
            </div>
          ) : (
            <div className="metadata-placeholder">
              <span>点击 "i" 键或按钮查看图片信息</span>
            </div>
          )}
        </div>
      </div>

      <div className="lightbox-close" onClick={onClose}></div>
      
      {/* Info button */}
      <button className="lightbox-info-btn" onClick={toggleMetadata} title="显示图片信息 (按 i 键)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </button>
      
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