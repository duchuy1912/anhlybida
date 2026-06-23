"use client";

import { useState } from 'react';
import Image from 'next/image';
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
          <Image 
            src={mainImage} 
            alt={productName} 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.mainImage} 
            style={{ objectFit: 'contain' }}
          />
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
                <Image 
                  src={img} 
                  alt={`${productName} thumbnail ${index + 1}`} 
                  fill
                  sizes="100px"
                  className={styles.thumbnail} 
                  style={{ objectFit: 'cover' }}
                />
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
          <div 
            className={styles.lightboxContent}
            onClick={e => e.stopPropagation()}
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Image 
              src={mainImage} 
              alt={productName} 
              fill
              className={styles.lightboxImage} 
              style={{ objectFit: 'contain' }}
              unoptimized={zoomLevel > 1}
            />
          </div>
        </div>
      )}
    </>
  );
}
