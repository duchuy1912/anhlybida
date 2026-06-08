"use client";

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from '@/app/shop/[id]/page.module.css';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    selectedOptions?: any;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      selectedOptions: product.selectedOptions
    });
  };

  return (
    <button onClick={handleAddToCart} className={styles.buyButton}>
      {t('addToCart')}
    </button>
  );
}
