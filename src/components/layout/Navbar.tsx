"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Moon, Sun, Menu, X, Home, Headphones } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { removeVietnameseTones } from '@/utils/string';
import ContactPopup from '@/components/shop/ContactPopup';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, formatPrice } = useCurrency();
  
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<any>({});
  
  // Trạng thái theo dõi cuộn trang
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowBottomNav(false); // Vuốt xuống
      } else {
        setShowBottomNav(true);  // Vuốt lên
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    const fetchInitialData = async () => {
      const { supabase } = await import('@/lib/supabaseClient');
      const [catsRes, prodsRes, contactRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('id, name, price, images'),
        supabase.from('site_settings').select('value').eq('key', 'contact_info').single()
      ]);
      
      if (catsRes.data) setCategories(catsRes.data);
      if (prodsRes.data) setAllProducts(prodsRes.data);
      if (contactRes.data && contactRes.data.value) {
        try {
          const parsed = typeof contactRes.data.value === 'string' ? JSON.parse(contactRes.data.value) : contactRes.data.value;
          setContactInfo(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/shop`);
    }
  };

  const filteredSearch = searchQuery.trim() === '' ? [] : allProducts.filter(p => 
    removeVietnameseTones(p.name).includes(removeVietnameseTones(searchQuery))
  ).slice(0, 5);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (!isMobileSearchOpen) {
      setTimeout(() => {
        const input = document.querySelector(`.${styles.searchInput}`) as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    }
  };

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`}>
        {/* Mobile Hamburger */}
        <button 
          className={styles.mobileMenuBtn} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="Anhly Bida Logo" style={{ height: '70px', width: 'auto', maxHeight: '100%' }} />
        </Link>
        
        {/* Desktop Links */}
        <div className={styles.links}>
          <Link href="/" className={styles.link}>{t('home')}</Link>
          <div className={styles.dropdown}>
            <Link href="/shop" className={styles.link} style={{ display: 'flex', alignItems: 'center', height: '100%' }}>{t('shop')}</Link>
            {categories && categories.length > 0 && (
              <div className={styles.dropdownContent}>
                {categories.map(c => (
                  <Link key={c.id} href={`/shop?category=${c.slug}`} className={styles.dropdownItem}>
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/about" className={styles.link}>{t('about')}</Link>
          <Link href="/contact" className={styles.link}>{t('contact')}</Link>
        </div>

        {/* Actions (Search, Theme, Cart) */}
        <div className={styles.actions}>
          <div className={`${styles.searchContainer} ${isMobileSearchOpen ? styles.searchMobileActive : ''}`} ref={searchContainerRef}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input 
                type="text" 
                placeholder={t('search')} 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <button 
                type="button" 
                className={styles.searchButton} 
                aria-label="Tìm kiếm"
                onClick={() => handleSearch(new Event('submit') as any)}
              >
                <Search size={18} />
              </button>
            </form>

            {isSearchFocused && searchQuery.trim() !== '' && (
              <div className={styles.searchResults}>
                {filteredSearch.length > 0 ? (
                  filteredSearch.map(product => (
                    <Link 
                      key={product.id} 
                      href={`/shop/${product.id}`} 
                      className={styles.searchResultItem}
                      onClick={() => { setIsSearchFocused(false); setIsMobileSearchOpen(false); }}
                    >
                      <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'} 
                        alt={product.name} 
                        className={styles.searchResultImage} 
                      />
                      <div className={styles.searchResultInfo}>
                        <span className={styles.searchResultName}>{product.name}</span>
                        <span className={styles.searchResultPrice}>
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className={styles.searchResultEmpty}>
                    {t('noProducts')} "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {mounted && (
            <>

              <button 
                className={styles.themeBtn} 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Đổi giao diện"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </>
          )}

          <button className={styles.cartButton} aria-label="Giỏ hàng" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={24} />
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileSidebarOverlay} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.mobileSidebar} onClick={e => e.stopPropagation()}>
            <div className={styles.mobileSidebarHeader}>
              <img src="/logo.png" alt="Anhly Bida" style={{ height: '40px' }} />
              <button className={styles.mobileCloseBtn} onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.mobileSidebarLinks}>
              <Link href="/" className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>{t('home')}</Link>
              <Link href="/shop" className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>{t('shop')}</Link>
              <Link href="/about" className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>{t('about')}</Link>
              <Link href="/contact" className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>{t('contact')}</Link>
              <div className={styles.mobileSidebarDivider}></div>
              <span className={styles.mobileSidebarTitle}>{t('categories')}</span>
              {categories.map(c => (
                <Link key={c.id} href={`/shop?category=${c.slug}`} className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {mounted && (
        <div className={`${styles.bottomNav} ${showBottomNav ? styles.bottomNavVisible : styles.bottomNavHidden}`}>
          <Link href="/" className={styles.bottomNavItem}>
            <Home size={22} />
            <span>Trang chủ</span>
          </Link>

          <button 
            className={styles.bottomNavItem} 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            <span>Sáng/Tối</span>
          </button>

          <button className={styles.bottomNavItem} onClick={() => setIsCartOpen(true)}>
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={22} />
              {totalItems > 0 && <span className={styles.cartBadgeSmall}>{totalItems}</span>}
            </div>
            <span>Giỏ hàng</span>
          </button>

          <ContactPopup 
            contactInfo={contactInfo}
            customTrigger={
              <button className={styles.bottomNavItem}>
                <Headphones size={22} />
                <span>Hỗ trợ</span>
              </button>
            }
          />

          <button className={styles.bottomNavItem} onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={22} />
            <span>Menu</span>
          </button>
        </div>
      )}
    </header>
  );
}
