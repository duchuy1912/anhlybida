"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [contactInfo, setContactInfo] = useState({
    phone: '0123 456 789',
    email: 'contact@anhlybida.com',
    address: '123 Đường Bida, TP. HCM',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'contact_info')
        .single();
      
      if (data && data.value) {
        try {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setContactInfo(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Lỗi đọc cấu trúc Liên hệ ở Footer:", e);
        }
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.col}>
          <h3>Anhly Bida</h3>
          <p>Uy Tín - Chất Lượng - Đẳng Cấp</p>
          <p>Chuyên cung cấp các loại cơ bida và phụ kiện chính hãng với giá tốt nhất thị trường.</p>
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
          <p>Điện thoại: {contactInfo.phone}</p>
          <p>Email: {contactInfo.email}</p>
          <p>Địa chỉ: {contactInfo.address}</p>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>&copy; {new Date().getFullYear()} Anhly Bida. All rights reserved.</p>
      </div>
    </footer>
  );
}
