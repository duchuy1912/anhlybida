"use client";

import React, { useState } from 'react';
import ProductOptions from '@/components/shop/ProductOptions';
import AddToCartButton from '@/components/shop/AddToCartButton';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
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
}

export default function ProductOrderForm({ product }: ProductOrderFormProps) {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [selectedOptions, setSelectedOptions] = useState<any>(null);

  const productImages = product.images && product.images.length > 0 ? product.images : ['/images/cue_1.png'];

  const isOldSpecsFormat = Array.isArray(product.specs);
  const options = React.useMemo(() => isOldSpecsFormat ? {} : (product.specs || {}), [isOldSpecsFormat, product.specs]);

  return (
    <>
      <div className={styles.price}>{formatPrice(totalPrice)}</div>
      
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
