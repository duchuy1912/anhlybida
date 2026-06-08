"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProductForm from '@/components/admin/ProductForm';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        alert('Lỗi tải sản phẩm: ' + error.message);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Đang tải dữ liệu sản phẩm...</div>;
  }

  if (!product) {
    return <div style={{ padding: '2rem' }}>Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '2rem' }}>Chỉnh sửa Sản phẩm</h1>
      <ProductForm initialData={product} />
    </div>
  );
}
