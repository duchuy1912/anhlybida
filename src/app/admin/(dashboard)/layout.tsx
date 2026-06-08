"use client";

import Link from 'next/link';
import { logoutAction } from '@/app/admin/login/actions';
import styles from './layout.module.css';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Package, Tags, PlusSquare, ArrowLeft, LogOut, Image, Menu, X, Sun, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeOrderCount, setActiveOrderCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchOrderCount = async () => {
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'processing', 'shipping']);
      
      if (count !== null) setActiveOrderCount(count);
    };

    fetchOrderCount();
    const interval = setInterval(fetchOrderCount, 15000); // 15 giây cập nhật 1 lần
    return () => clearInterval(interval);
  }, []);

  // Đóng sidebar khi đổi trang trên mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={styles.adminLayout}>
      {/* Lớp màng mờ trên mobile */}
      <div 
        className={`${styles.overlay} ${isSidebarOpen ? styles.overlayOpen : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          BIDA<span>ADMIN</span>
          <button className={styles.menuToggleBtn} onClick={() => setIsSidebarOpen(false)} style={{ color: 'white', display: 'flex', marginLeft: 'auto', padding: '0 1rem' }}>
            <X size={24} />
          </button>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/orders" className={pathname === '/admin/orders' ? styles.activeLink : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} /> Đơn hàng
            </div>
            {activeOrderCount > 0 && (
              <span style={{ background: '#ff4d4f', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>
                {activeOrderCount}
              </span>
            )}
          </Link>
          <Link href="/admin/products" className={pathname === '/admin/products' ? styles.activeLink : ''}>
            <Package size={18} /> Sản phẩm
          </Link>
          <Link href="/admin/categories" className={pathname === '/admin/categories' ? styles.activeLink : ''}>
            <Tags size={18} /> Danh mục
          </Link>
          <Link href="/admin/banners" className={pathname === '/admin/banners' ? styles.activeLink : ''}>
            <Image size={18} /> Quản lý Banner
          </Link>
          <Link href="/admin/add" className={pathname === '/admin/add' ? styles.activeLink : ''}>
            <PlusSquare size={18} /> Thêm Sản phẩm
          </Link>
          <Link href="/admin/about" className={pathname === '/admin/about' ? styles.activeLink : ''}>
            <Image size={18} /> Trang Giới Thiệu
          </Link>
          <Link href="/admin/contact" className={pathname === '/admin/contact' ? styles.activeLink : ''}>
            <Image size={18} /> Trang Liên Hệ
          </Link>
          
          <div style={{ margin: '2rem 1.5rem', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          
          <Link href="/" style={{ color: '#8c8c8c' }}>
            <ArrowLeft size={18} /> Trở về Cửa hàng
          </Link>
          <form action={logoutAction} style={{ marginTop: 'auto' }}>
            <button type="submit" className={styles.logoutBtn}>
              <LogOut size={18} /> Đăng xuất
            </button>
          </form>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggleBtn} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <span style={{ fontSize: '1.1rem' }}>Hệ thống Quản lý</span>
          </div>
          <div className={styles.headerRight}>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Đổi giao diện"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.card}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
