import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  images?: string[];
}

export default function ProductCard({ id, name, category, price, imageUrl, images }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

  const hasImage = images && images.length > 0;
  const displayImage = hasImage ? images[0] : null;

  return (
    <Link href={`/shop/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {hasImage ? (
          <Image 
            src={displayImage!} 
            alt={name} 
            fill
            sizes="(max-width: 768px) 50vw, 30vw"
            className={styles.image} 
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#999', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            Chưa có hình ảnh
          </div>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.price}>{formattedPrice}</span>
      </div>
    </Link>
  );
}
