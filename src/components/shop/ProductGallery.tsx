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
  const hasImages = images && images.length > 0;
  const [mainImage, setMainImage] = useState(hasImages ? images[0] : '');
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

  if (!hasImages) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.mainImageWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#999', flexDirection: 'column', padding: '2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', opacity: 0.3 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <h3>Chưa có hình ảnh</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Hình ảnh sản phẩm đang được cập nhật</p>
        </div>
      </div>
    );
  }

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
