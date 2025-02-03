import photos from '../data/photos.json';

export function getRandomPhoto() {
    const allPhotos = Object.values(photos.photoGroups).flat();
    return allPhotos[Math.floor(Math.random() * allPhotos.length)];
  }