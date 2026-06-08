import { Suspense } from 'react';
import ShopContent from './ShopContent';
import styles from './page.module.css';
import { supabase } from '@/lib/supabaseClient';

export default async function ShopPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const allProducts = products || [];

  return (
    <main className={`container ${styles.shopPage}`}>
      <h1 className={styles.title}>Cửa Hàng Bida</h1>
      <Suspense fallback={<div className={styles.loading}>Đang tải dữ liệu...</div>}>
        <ShopContent initialProducts={allProducts} />
      </Suspense>
    </main>
  );
}
