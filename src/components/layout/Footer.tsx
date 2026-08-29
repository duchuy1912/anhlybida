"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function Footer() {
  const { contactInfo } = useSiteSettings();
  
  const displayContact = {
    phone: contactInfo?.phone || '0123 456 789',
    email: contactInfo?.email || 'contact@anhlybida.com',
    address: contactInfo?.address || '123 ��?ng Bida, TP. HCM',
  };

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.col}>
          <h3>Anhly Bida</h3>
          <p>Uy Tín - Chất Lượng - Đẳng Cấp</p>
          <p>Xưởng trực tiếp gia công, sản xuất và cung cấp các loại cơ bida, phụ kiện bida chất lượng với giá tốt nhất thị trường.</p>
        </div>
        <div className={styles.col}>
          <h3>Liên kết</h3>
          <ul>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/shop">Sản phẩm</Link></li>
            <li><Link href="/about">Về chúng tôi</Link></li>
            <li><Link href="/contact">Liên hệ</Link></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h3>Liên hệ</h3>
          <p>Điện thoại: {displayContact.phone}</p>
          <p>Email: {displayContact.email}</p>
          <p>Địa chỉ: {displayContact.address}</p>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>&copy; {new Date().getFullYear()} Anhly Bida. All rights reserved.</p>
      </div>
    </footer>
  );
}

