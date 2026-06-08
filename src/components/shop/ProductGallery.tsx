"use client";

import { useState } from 'react';
import { ZoomIn, ZoomOut, X, Maximize2 } from 'lucide-react';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoomLevel(1);
  };

  return (
    <>
      <div className={styles.galleryContainer}>
        <div className={styles.mainImageWrapper} onClick={() => setIsLightboxOpen(true)}>
          <img src={mainImage} alt={productName} className={styles.mainImage} />
          <button className={styles.expandBtn}><Maximize2 size={20} /></button>
        </div>
        
        {images.length > 1 && (
          <div className={styles.thumbnailStrip}>
            {images.map((img, index) => (
              <div 
                key={index} 
                className={`${styles.thumbnailWrapper} ${mainImage === img ? styles.activeThumbnail : ''}`}
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt={`${productName} thumbnail ${index + 1}`} className={styles.thumbnail} />
              </div>
            ))}
          </div>
        )}
      </div>

      {isLightboxOpen && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div className={styles.lightboxToolbar} onClick={e => e.stopPropagation()}>
            <button onClick={handleZoomIn} className={styles.lightboxBtn} title="Phóng to"><ZoomIn size={24} /></button>
            <button onClick={handleZoomOut} className={styles.lightboxBtn} title="Thu nhỏ"><ZoomOut size={24} /></button>
            <button onClick={closeLightbox} className={styles.lightboxBtn} title="Đóng"><X size={24} /></button>
          </div>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <img 
              src={mainImage} 
              alt={productName} 
              className={styles.lightboxImage} 
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
        </div>
      )}
    </>
  );
}
