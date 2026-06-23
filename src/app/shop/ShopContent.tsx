"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import { removeVietnameseTones } from '@/utils/string';
import { useLanguage } from '@/context/LanguageContext';
import Pagination from '@/components/ui/Pagination';
import styles from './page.module.css';

interface ShopContentProps {
  initialProducts: any[];
}

export default function ShopContent({ initialProducts }: ShopContentProps) {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([{ id: 'all', name: 'all', slug: 'all', filter: 'all' }]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lọc giá và màu sắc
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const availableColors = Array.from(new Set(initialProducts
    .map(p => {
      if (p.specs && !Array.isArray(p.specs) && p.specs.color) {
        return p.specs.color;
      }
      return null;
    })
    .filter(Boolean) as string[]
  ));

  useEffect(() => {
    const fetchCategories = async () => {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data } = await supabase.from('categories').select('*').order('name');
      
      if (data) {
        const formattedCats = [
          { id: 'all', name: 'all', slug: 'all', filter: 'all' },
          ...data.map(c => ({ id: c.slug, name: c.name, slug: c.slug, filter: c.name }))
        ];
        setCategories(formattedCats);
        
        if (categoryQuery) {
          const matched = formattedCats.find(c => c.slug === categoryQuery);
          if (matched) {
            setActiveCategory(matched.filter);
          }
        }
      }
    };
    
    fetchCategories();
  }, [categoryQuery]);

  useEffect(() => {
    if (searchQuery) {
      setActiveCategory("all");
    }
  }, [searchQuery]);

  let filteredProducts = activeCategory === "all" 
    ? initialProducts 
    : initialProducts.filter(p => p.category === activeCategory);

  if (searchQuery) {
    const q = removeVietnameseTones(searchQuery);
    filteredProducts = filteredProducts.filter(p => 
      removeVietnameseTones(p.name).includes(q) || 
      (p.description && removeVietnameseTones(p.description).includes(q))
    );
  }

  // Lọc theo Giá
  filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);

  // Lọc theo Màu sắc
  if (selectedColor) {
    filteredProducts = filteredProducts.filter(p => {
      if (p.specs && !Array.isArray(p.specs)) {
        return p.specs.color === selectedColor;
      }
      return false;
    });
  }

  // Reset trang về 1 khi đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, minPrice, maxPrice, selectedColor, searchQuery]);

  // Lấy danh sách sản phẩm cho trang hiện tại
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleClearFilters = () => {
    setActiveCategory("all");
    setMinPrice(0);
    setMaxPrice(50000000);
    setSelectedColor(null);
  };

  // Vô hiệu hóa cuộn khi mở bộ lọc trên mobile
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileFilterOpen]);

  return (
    <>
      <div className={styles.mobileFilterToggleContainer}>
        <button 
          className={styles.mobileFilterBtn} 
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          Bộ lọc {((activeCategory !== 'all' ? 1 : 0) + (selectedColor ? 1 : 0) + (minPrice > 0 || maxPrice < 50000000 ? 1 : 0)) > 0 && `(${((activeCategory !== 'all' ? 1 : 0) + (selectedColor ? 1 : 0) + (minPrice > 0 || maxPrice < 50000000 ? 1 : 0))})`}
        </button>
      </div>

      <div className={`${styles.overlay} ${isMobileFilterOpen ? styles.open : ''}`} onClick={() => setIsMobileFilterOpen(false)}></div>

      <div className={styles.shopLayout}>
        <aside className={`${styles.sidebar} ${isMobileFilterOpen ? styles.open : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <h3 className={styles.filterTitle} style={{ margin: 0, padding: 0, border: 'none' }}>{t('filter')}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={handleClearFilters} className={styles.clearFilterBtn} style={{ padding: '0.2rem 0.5rem' }}>✖ Xóa</button>
            <button className={styles.closeFilterBtnMobile} onClick={() => setIsMobileFilterOpen(false)}>✕</button>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h4 className={styles.filterSubtitle}>{t('categories')}</h4>
          <ul className={styles.filterList}>
            {categories.map(cat => (
              <li key={cat.id}>
                <button 
                  className={`${styles.filterBtn} ${activeCategory === cat.filter ? styles.activeFilter : ''}`}
                  onClick={() => setActiveCategory(cat.filter)}
                >
                  {cat.id === 'all' ? t('all') : cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.filterGroup}>
          <h4 className={styles.filterSubtitle}>{t('price')}</h4>
          <div className={styles.priceFilter}>
            <input 
              type="range" 
              min="0" max="50000000" step="500000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className={styles.priceSlider}
            />
            <div className={styles.priceInputs}>
              <div className={styles.priceInputWrapper}>
                <input 
                  type="number" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)} 
                  className={styles.priceInput}
                />
                <span>đ</span>
              </div>
              <span className={styles.priceSeparator}>-</span>
              <div className={styles.priceInputWrapper}>
                <input 
                  type="number" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)} 
                  className={styles.priceInput}
                />
                <span>đ</span>
              </div>
            </div>
          </div>
        </div>

        {availableColors.length > 0 && (
          <div className={styles.filterGroup}>
            <h4 className={styles.filterSubtitle}>{t('color')}</h4>
            <div className={styles.colorFilter}>
              {availableColors.map((color, idx) => (
                <button 
                  key={idx}
                  className={`${styles.colorBtn} ${selectedColor === color ? styles.activeColor : ''}`}
                  onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.resultsCount}>
          {t('showing')} <strong>{filteredProducts.length}</strong> {t('products')}
        </div>
        
        {paginatedProducts.length > 0 ? (
          <>
            <div className={styles.productGrid}>
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        ) : (
          <div className={styles.emptyState}>
            {t('noProducts')}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
