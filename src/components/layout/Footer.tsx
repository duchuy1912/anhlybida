"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function Footer() {
  const { contactInfo } = useSiteSettings();
  
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
          {contactInfo?.phone && <p>Điện thoại: {contactInfo.phone}</p>}
          {contactInfo?.email && <p>Email: {contactInfo.email}</p>}
          {contactInfo?.address && <p>Địa chỉ: {contactInfo.address}</p>}
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>&copy; {new Date().getFullYear()} Anhly Bida. All rights reserved.</p>
      </div>
    </footer>
  );
}


