"use client";

import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  const formattedTotalPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalPrice);

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsCartOpen(false)} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <ShoppingBag /> {t('cart')}
          </h2>
          <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <p>{t('emptyCart')}</p>
              <button onClick={() => setIsCartOpen(false)} className={styles.continueBtn}>
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map(item => (
                <div key={item.cartItemId || item.id} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemDetails}>
                    <div>
                      <div className={styles.itemHeader}>
                        <h4 className={styles.itemName}>
                          {item.name} {item.category && <span style={{fontSize: '0.85em', color: '#666'}}>({item.category})</span>}
                        </h4>
                        <button onClick={() => removeFromCart(item.cartItemId || item.id)} className={styles.removeBtn}><X size={16} /></button>
                      </div>
                      
                      {item.selectedOptions && (
                        <div className={styles.itemOptions}>
                          {item.selectedOptions.shaft && <div>Ngọn: {item.selectedOptions.shaft.name}</div>}
                          {item.selectedOptions.upgrades && item.selectedOptions.upgrades.length > 0 && <div>Nâng cấp: {item.selectedOptions.upgrades.join(', ')}</div>}
                          {item.selectedOptions.engraving && <div>Khắc: "{item.selectedOptions.engraving.text}" ({item.selectedOptions.engraving.style})</div>}
                          {item.selectedOptions.otherRequests && <div>Yêu cầu khác: {item.selectedOptions.otherRequests}</div>}
                        </div>
                      )}
                    </div>
                    <div className={styles.itemFooter}>
                      <div className={styles.quantityControl}>
                        <button onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)} className={styles.quantityBtn}><Minus size={14} /></button>
                        <span className={styles.quantityValue}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)} className={styles.quantityBtn}><Plus size={14} /></button>
                      </div>
                      <span className={styles.itemPrice}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>{t('total')}:</span>
              <span className={styles.totalPrice}>{formattedTotalPrice}</span>
            </div>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)} className={styles.checkoutBtn}>
              {t('checkout').toUpperCase()}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
