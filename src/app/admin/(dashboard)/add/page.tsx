import ProductForm from '@/components/admin/ProductForm';
import styles from '../layout.module.css';

export default function AddProductPage() {
  return (
    <div>
      <h1 className={styles.title}>Thêm Sản Phẩm Mới</h1>
      <ProductForm />
    </div>
  );
}
