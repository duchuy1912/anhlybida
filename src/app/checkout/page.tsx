"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    notes: ''
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Fetch provinces on mount
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict('');
      return;
    }
    const pCode = provinces.find(p => p.name === selectedProvince)?.code;
    if (pCode) {
      fetch(`https://provinces.open-api.vn/api/p/${pCode}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts))
        .catch(console.error);
    }
  }, [selectedProvince, provinces]);

  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard('');
      return;
    }
    const dCode = districts.find(d => d.name === selectedDistrict)?.code;
    if (dCode) {
      fetch(`https://provinces.open-api.vn/api/d/${dCode}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards))
        .catch(console.error);
    }
  }, [selectedDistrict, districts]);

  if (!isClient) return null; // Tránh hydration mismatch

  if (items.length === 0) {
    return (
      <div className={styles.checkoutContainer} style={{ textAlign: 'center', padding: '10rem 1rem' }}>
        <h2>{t('checkoutEmptyTitle')}</h2>
        <p style={{ margin: '1rem 0 2rem', color: '#666' }}>{t('checkoutEmptyDesc')}</p>
        <Link href="/shop" style={{ padding: '1rem 2rem', backgroundColor: 'var(--color-primary-dark)', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          {t('backToShop')}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvince || !selectedDistrict || !selectedWard || !streetAddress.trim()) {
      alert("Vui lòng nhập đầy đủ địa chỉ nhận hàng.");
      return;
    }

    setLoading(true);

    const finalAddress = `${streetAddress}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}, Việt Nam`;

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.fullName,
          phone: formData.phone,
          address: finalAddress,
          notes: formData.notes,
          total_amount: totalPrice,
          items: items // JSON array
        });

      if (error) throw error;

      // Build items list for Telegram
      const itemsListText = items.map((item, index) => {
        const cat = item.category ? `(${item.category})` : '';
        const priceStr = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price);
        
        let optionText = '';
        if (item.selectedOptions) {
          const opts = [];
          if (item.selectedOptions.shaft) opts.push(`Ngọn: ${item.selectedOptions.shaft.name}`);
          if (item.selectedOptions.upgrades?.length) opts.push(`NC: ${item.selectedOptions.upgrades.join(', ')}`);
          if (item.selectedOptions.engraving) opts.push(`Khắc: ${item.selectedOptions.engraving.text}`);
          if (opts.length > 0) optionText = `\n   ↳ ` + opts.join(' | ');
        }
        
        return `${index + 1}. ${item.name} ${cat} x${item.quantity} - ${priceStr}${optionText}`;
      }).join('\n');

      // Notify Telegram
      try {
        const message = `🚨 <b>CÓ ĐƠN HÀNG MỚI!</b>
👤 <b>Khách hàng:</b> ${formData.fullName}
📱 <b>SĐT:</b> ${formData.phone}
📍 <b>Địa chỉ:</b> ${finalAddress}
💰 <b>Tổng tiền:</b> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
📝 <b>Ghi chú:</b> ${formData.notes || 'Không có'}

📦 <b>DANH SÁCH SẢN PHẨM:</b>
${itemsListText}`;

        await fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
      } catch (tgError) {
        console.error('Failed to send Telegram notification', tgError);
      }

      clearCart();
      router.push('/checkout/success');

    } catch (error: any) {
      console.error(error);
      alert('Có lỗi xảy ra khi đặt hàng: ' + error.message);
      setLoading(false);
    }
  };

  const formattedTotalPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalPrice);

  return (
    <main className={styles.checkoutContainer}>
      <h1 className={styles.title}>{t('checkout')}</h1>
      
      <form onSubmit={handleSubmit} className={styles.layout}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>{t('checkoutDetails')}</h2>
          
          <div className={styles.formGroup}>
            <label>{t('fullName')}</label>
            <input required type="text" className={styles.input} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="" />
          </div>

          <div className={styles.formGroup}>
            <label>{t('phone')}</label>
            <input required type="tel" className={styles.input} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="" />
          </div>

          <div className={styles.formGroup}>
            <label>{t('province')}</label>
            <select required className={styles.input} value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)}>
              <option value="">--</option>
              {provinces.map(p => (
                <option key={p.code} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label>{t('district')}</label>
              <select required className={styles.input} value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedProvince}>
                <option value="">--</option>
                {districts.map(d => (
                  <option key={d.code} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>{t('ward')}</label>
              <select required className={styles.input} value={selectedWard} onChange={e => setSelectedWard(e.target.value)} disabled={!selectedDistrict}>
                <option value="">--</option>
                {wards.map(w => (
                  <option key={w.code} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>{t('address')}</label>
            <input required type="text" className={styles.input} value={streetAddress} onChange={e => setStreetAddress(e.target.value)} placeholder="..." />
          </div>

          <div className={styles.formGroup}>
            <label>{t('orderNotes')}</label>
            <textarea className={styles.textarea} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="..." style={{ minHeight: '80px' }} />
          </div>

          <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>{t('paymentMethod')}</h2>
          <div className={styles.paymentMethod}>
            <input type="radio" checked readOnly id="cod" />
            <div>
              <strong>{t('cod')}</strong>
              <p>{t('codDesc')}</p>
            </div>
          </div>
        </div>

        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>{t('yourOrder')} ({totalItems} {t('products')})</h2>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
            {items.map(item => (
              <div key={item.cartItemId || item.id} className={styles.summaryItem}>
                <div className={styles.itemInfo}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div>
                    <div className={styles.itemName}>
                      {item.name} {item.category && <span style={{fontSize: '0.85em', color: '#666'}}>({item.category})</span>}
                    </div>
                    
                    {item.selectedOptions && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px', marginBottom: '4px', lineHeight: '1.4' }}>
                        {item.selectedOptions.shaft && <div>Ngọn: {item.selectedOptions.shaft.name}</div>}
                        {item.selectedOptions.upgrades && item.selectedOptions.upgrades.length > 0 && <div>Nâng cấp: {item.selectedOptions.upgrades.join(', ')}</div>}
                        {item.selectedOptions.engraving && <div>Khắc: "{item.selectedOptions.engraving.text}" ({item.selectedOptions.engraving.style})</div>}
                        {item.selectedOptions.otherRequests && <div>Yêu cầu khác: {item.selectedOptions.otherRequests}</div>}
                      </div>
                    )}
                    
                    <div className={styles.itemQty}>Số lượng: {item.quantity}</div>
                  </div>
                </div>
                <div className={styles.itemPrice}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>{t('subtotal')}:</span>
              <span>{formattedTotalPrice}</span>
            </div>
            <div className={styles.totalRow}>
              <span>{t('shippingFee')}:</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{t('freeTemp')}</span>
            </div>
            <div className={styles.grandTotal}>
              <span>{t('total')}:</span>
              <span>{formattedTotalPrice}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? t('processing') : t('confirmOrder')}
          </button>
        </div>
      </form>
    </main>
  );
}
