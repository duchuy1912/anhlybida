"use client";

import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProductCard from "@/components/shop/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";


export default function HomeContent({ allProducts, categories = [] }: { allProducts: any[], categories?: any[] }) {
  const { t } = useLanguage();

  // If DB categories are available, use them, otherwise fallback to extracting from products
  const activeCategories = categories.length > 0 
    ? categories.map(c => ({ id: c.slug, name: c.name, filter: c.name }))
    : Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean).map(cat => ({
        id: cat,
        name: cat,
        filter: cat
      }));

  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <div className="container" style={{ padding: '5rem 1rem' }}>
        {activeCategories.map((category) => {
          const categoryProducts = allProducts
            .filter(p => p.category === category.filter)
            .slice(0, 4);

          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.id} className={styles.categorySection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Link href={`/shop?category=${category.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {category.name}
                  </Link>
                </h2>
                <Link href={`/shop?category=${category.id}`} className={styles.viewAllButton}>
                  {t('viewAll')} 
                  <span className={styles.arrow}>&rarr;</span>
                </Link>
              </div>
              
              <div className={styles.productGrid}>
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </section>
          );
        })}
        
        {allProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
            <h2>{t('noProductsHome')}</h2>
            <p>Hãy truy cập trang Quản trị (Admin) để thêm sản phẩm mới nhé.</p>
            <Link href="/admin/add" style={{ display: 'inline-block', marginTop: '1rem', padding: '10px 20px', background: '#c4a470', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>
              {t('goToAdmin')}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
