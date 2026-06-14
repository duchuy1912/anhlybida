"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';

interface ProductDetailsInfoProps {
  product: {
    description?: string;
    specs?: any;
  };
}

export default function ProductDetailsInfo({ product }: ProductDetailsInfoProps) {
  const isOldSpecsFormat = Array.isArray(product.specs);
  const options = React.useMemo(() => isOldSpecsFormat ? {} : (product.specs || {}), [isOldSpecsFormat, product.specs]);

  const hasAttributes = isOldSpecsFormat 
    ? product.specs && product.specs.length > 0 
    : options.attributes && Array.isArray(options.attributes) && options.attributes.length > 0;

  const [isMobile, setIsMobile] = React.useState(false);
  const [isDescOpen, setIsDescOpen] = React.useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const videoId = getYoutubeVideoId(options.videoUrl);

  const videoContent = videoId ? (
    <div style={{ marginTop: '1rem', width: '100%', position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <iframe 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        src={`https://www.youtube.com/embed/${videoId}`} 
        title="YouTube video player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
    </div>
  ) : null;

  const descContent = (
    <p className={styles.description} style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
      {product.description || 'Sản phẩm bida cao cấp, thiết kế độc quyền với độ chính xác và cân bằng hoàn hảo.'}
    </p>
  );

  const specsContent = hasAttributes ? (
    <div className={styles.specs} style={{ marginTop: isMobile ? '1rem' : 0 }}>
      {!isMobile && <h2>Thông số kỹ thuật</h2>}
      <table className={styles.specsTable}>
        <tbody>
          {isOldSpecsFormat 
            ? product.specs.map((spec: any, idx: number) => (
                <tr key={idx}>
                  <th>{spec.name}</th>
                  <td>{spec.value}</td>
                </tr>
              ))
            : options.attributes.map((spec: any, idx: number) => (
                <tr key={idx}>
                  <th>{spec.name}</th>
                  <td>{spec.value}</td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  ) : null;

  return (
    <div style={{ marginTop: '2rem' }}>
      {videoContent}
      <div className={styles.divider} style={{ marginTop: videoId ? '2rem' : 0 }}></div>
      
      {isMobile ? (
        <div className={styles.mobileAccordionContainer}>
          <div className={styles.accordionItem}>
            <button 
              className={styles.accordionHeader} 
              onClick={() => setIsDescOpen(!isDescOpen)}
            >
              Mô tả
              <span className={styles.accordionIcon}>{isDescOpen ? '−' : '+'}</span>
            </button>
            {isDescOpen && <div className={styles.accordionContent}>{descContent}</div>}
          </div>

          {hasAttributes && (
            <div className={styles.accordionItem}>
              <button 
                className={styles.accordionHeader} 
                onClick={() => setIsSpecsOpen(!isSpecsOpen)}
              >
                Thông số kỹ thuật
                <span className={styles.accordionIcon}>{isSpecsOpen ? '−' : '+'}</span>
              </button>
              {isSpecsOpen && <div className={styles.accordionContent}>{specsContent}</div>}
            </div>
          )}
        </div>
      ) : (
        <>
          {descContent}
          {specsContent}
        </>
      )}
    </div>
  );
}
