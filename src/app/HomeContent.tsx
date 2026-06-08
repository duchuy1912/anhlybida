"use client";

import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProductCard from "@/components/shop/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";

const categoriesData = [
  { id: "co-libre", name: "Cơ Libre", filter: "Cơ Libre" },
  { id: "co-3-bang", name: "Cơ 3 Băng", filter: "Cơ 3 Băng" },
  { id: "co-pool", name: "Cơ Pool", filter: "Cơ Pool" },
  { id: "phu-kien", name: "Phụ Kiện", filter: "Phụ Kiện" },
];

export default function HomeContent({ allProducts }: { allProducts: any[] }) {
  const { t } = useLanguage();

  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <div className="container" style={{ padding: '5rem 1rem' }}>
        {categoriesData.map((category) => {
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
