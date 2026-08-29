import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ProductGallery from '@/components/shop/ProductGallery';
import AddToCartButton from '@/components/shop/AddToCartButton';
import ContactPopup from '@/components/shop/ContactPopup';
import ProductOrderForm from './ProductOrderForm';
import ProductDetailsInfo from './ProductDetailsInfo';
import styles from './page.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  
  // Fetch from Supabase
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();
  
  if (error || !product) {
    notFound();
  }

  // Fetch contact info for popup
  const { data: contactData } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'contact_info')
    .single();

  let contactInfo = {};
  if (contactData && contactData.value) {
    try {
      contactInfo = typeof contactData.value === 'string' ? JSON.parse(contactData.value) : contactData.value;
    } catch (e) {
      console.error(e);
    }
  }
  
  // Fetch global_shafts
  const { data: globalShaftsData } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'global_shafts')
    .single();
    
  let globalShafts = {};
  if (globalShaftsData && globalShaftsData.value) {
    try {
      globalShafts = typeof globalShaftsData.value === 'string' ? JSON.parse(globalShaftsData.value) : globalShaftsData.value;
    } catch (e) {
      console.error(e);
    }
  }

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  const productImages = product.images && product.images.length > 0 ? product.images : ['/images/cue_1.png'];

  return (
    <main className={`container ${styles.productPage}`}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Trang chủ</Link>
        <span className={styles.separator}>/</span>
        <Link href="/shop">Cửa hàng</Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>{product.name}</span>
      </div>

      <div className={styles.productLayout}>
        <div className={styles.imageSection}>
          <ProductGallery images={productImages} productName={product.name} />
          <ProductDetailsInfo product={product} />
        </div>

        <div className={styles.infoSection}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.title}>{product.name}</h1>
          <ProductOrderForm product={product} globalShafts={globalShafts} />
          
          <div className={styles.actions} style={{ marginTop: '1rem' }}>
            <ContactPopup contactInfo={contactInfo} />
          </div>
          
          <div className={styles.guarantee} style={{ display: 'none' }}>
            <p>✓ Giao hàng hỏa tốc toàn quốc</p>
            <p>✓ Bảo hành cong vênh 12 tháng</p>
            <p>✓ Tặng kèm bao da, lơ và găng tay</p>
          </div>
        </div>
      </div>
    </main>
  );
}
