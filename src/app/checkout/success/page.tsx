"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function CheckoutSuccessPage() {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  return (
    <main style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ width: '80px', height: '80px', backgroundColor: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      <h1 style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
        {isEn ? 'Order Successful!' : 'Đặt Hàng Thành Công!'}
      </h1>
      
      <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '2rem' }}>
        {isEn 
          ? <>Thank you for trusting and shopping at <strong>Anhly Billiards</strong>. Your order has been recorded in the system. We will call to confirm and deliver the goods as soon as possible.</>
          : <>Cảm ơn bạn đã tin tưởng và mua sắm tại <strong>Cơ bida Anhly</strong>. Đơn hàng của bạn đã được ghi nhận trên hệ thống. Chúng tôi sẽ gọi điện xác nhận và tiến hành giao hàng trong thời gian sớm nhất.</>
        }
      </p>

      <div style={{ backgroundColor: '#fafafa', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem', border: '1px dashed #ccc' }}>
        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{isEn ? 'Your temporary order ID:' : 'Mã đơn hàng tạm thời của bạn:'}</p>
        <h3 style={{ margin: '0.5rem 0 0', color: 'var(--color-accent)', letterSpacing: '2px' }}>
          AL-{Math.floor(100000 + Math.random() * 900000)}
        </h3>
      </div>

      <Link href="/shop" style={{ display: 'inline-block', padding: '1rem 2rem', backgroundColor: 'var(--color-primary-dark)', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
        {isEn ? 'CONTINUE SHOPPING' : 'TIẾP TỤC MUA SẮM'}
      </Link>
    </main>
  );
}
