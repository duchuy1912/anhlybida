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

  const displayImage = images && images.length > 0 ? images[0] : (imageUrl || '/images/cue_1.png');

  return (
    <Link href={`/shop/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image 
          src={displayImage} 
          alt={name} 
          fill
          sizes="(max-width: 768px) 50vw, 30vw"
          className={styles.image} 
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.info}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.price}>{formattedPrice}</span>
      </div>
    </Link>
  );
}
