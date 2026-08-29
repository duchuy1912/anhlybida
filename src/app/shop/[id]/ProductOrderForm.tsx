"use client";

import React, { useState } from 'react';
import ProductOptions from '@/components/shop/ProductOptions';
import AddToCartButton from '@/components/shop/AddToCartButton';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import styles from './page.module.css';

interface ProductOrderFormProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    specs: any;
    category?: string;
    description?: string;
  };
  globalShafts?: any;
}

export default function ProductOrderForm({ product, globalShafts = {} }: ProductOrderFormProps) {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [selectedOptions, setSelectedOptions] = useState<any>(null);

  const productImages = product.images && product.images.length > 0 ? product.images : ['/images/cue_1.png'];

  const isOldSpecsFormat = Array.isArray(product.specs);
  const options = React.useMemo(() => isOldSpecsFormat ? {} : (product.specs || {}), [isOldSpecsFormat, product.specs]);

  const activeShaftDetails = selectedOptions?.shaft ? (globalShafts[selectedOptions.shaft.name] || selectedOptions.shaft) : null;
  const hasShaftDetails = activeShaftDetails && (activeShaftDetails.image || activeShaftDetails.description || activeShaftDetails.specs);

  return (
    <>
      <div className={styles.price}>{formatPrice(totalPrice)}</div>
      
      {hasShaftDetails && (
        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '15px', border: '1px solid var(--color-accent)', borderRadius: '8px', background: 'rgba(212,175,55,0.05)' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--color-accent)' }}>Thông tin ngọn cơ: {activeShaftDetails.name || selectedOptions?.shaft?.name}</h4>
          
          {activeShaftDetails.image && (
            <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '10px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
              <Image 
                src={activeShaftDetails.image} 
                alt="Shaft" 
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                style={{ objectFit: 'contain' }} 
              />
            </div>
          )}
          
          {activeShaftDetails.description && (
            <details style={{ cursor: 'pointer', margin: '5px 0' }}>
              <summary style={{ fontWeight: 600, color: 'var(--color-text-main)', outline: 'none' }}>Chi tiết & Mô tả ngọn cơ</summary>
              <div style={{ padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', marginTop: '5px', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--color-text-muted)' }}>
                {activeShaftDetails.description.split('\n').map((line: string, i: number) => <p key={i} style={{ margin: '0 0 5px 0' }}>{line}</p>)}
              </div>
            </details>
          )}
          
          {activeShaftDetails.specs && (
            <details style={{ cursor: 'pointer', margin: '5px 0' }}>
              <summary style={{ fontWeight: 600, color: 'var(--color-text-main)', outline: 'none' }}>Thông số kỹ thuật</summary>
              <div style={{ padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', marginTop: '5px', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--color-text-muted)' }}>
                {activeShaftDetails.specs.split('\n').map((line: string, i: number) => <p key={i} style={{ margin: '0 0 5px 0' }}>{line}</p>)}
              </div>
            </details>
          )}
        </div>
      )}
      
      <div className={styles.divider}></div>

      <ProductOptions 
        basePrice={product.price}
        options={options}
        onTotalChange={(total, options) => {
          setTotalPrice(total);
          setSelectedOptions(options);
        }}
      />
      
      <div className={styles.actions}>
        <AddToCartButton 
          product={{
            id: product.id,
            name: product.name,
            price: totalPrice,
            image: productImages[0],
            category: product.category,
            selectedOptions: selectedOptions
          }} 
        />
      </div>
    </>
  );
}
