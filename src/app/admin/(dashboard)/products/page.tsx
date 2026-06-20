"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Edit, Copy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { removeVietnameseTones } from '@/utils/string';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Pagination from '@/components/ui/Pagination';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'info' | 'warning';
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Xác nhận',
    onConfirm: () => {}
  });

  const fetchProducts = async () => {
    const { data: prodData, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: catData, error: catErr } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (prodErr || catErr) {
      console.error(prodErr, catErr);
    } else {
      setProducts(prodData || []);
      setCategories(catData || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id: string, name: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "${name.trim()}"? Hành động này không thể hoàn tác.`,
      type: 'danger',
      confirmText: 'Xóa vĩnh viễn',
      onConfirm: async () => {
        const productToDelete = products.find(p => p.id === id);
        
        if (productToDelete?.images?.length > 0) {
          const filesToRemove = productToDelete.images.map((url: string) => {
            const parts = url.split('/');
            return parts.pop();
          }).filter(Boolean);
          
          if (filesToRemove.length > 0) {
            await supabase.storage.from('product-images').remove(filesToRemove);
          }
        }

        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
          
        if (error) {
          alert('Lỗi khi xóa sản phẩm: ' + error.message);
        } else {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      }
    });
  };

  const handleDuplicate = (product: any) => {
    setModalConfig({
      isOpen: true,
      title: 'Nhân bản sản phẩm',
      message: `Bạn muốn tạo một bản sao của sản phẩm "${product.name.trim()}"?`,
      type: 'info',
      confirmText: 'Nhân bản',
      onConfirm: async () => {
        setLoading(true);
        // Create a copy of the product, omitting id and created_at
        const { id, created_at, ...productData } = product;
        const newProduct = {
          ...productData,
          name: productData.name
        };

        const { data, error } = await supabase
          .from('products')
          .insert([newProduct])
          .select()
          .single();

        if (error) {
          alert('Lỗi khi nhân bản sản phẩm: ' + error.message);
          setLoading(false);
        } else if (data) {
          // Redirect to edit page
          router.push(`/admin/edit/${data.id}`);
        }
      }
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = removeVietnameseTones(p.name).includes(removeVietnameseTones(searchQuery));
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return <div>Đang tải danh sách sản phẩm...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem' }}>Quản lý Sản phẩm</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm sản phẩm..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: '1 1 200px', padding: '0.8rem 1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', background: 'var(--color-bg)', color: 'var(--color-text-main)' }}
        />
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ flex: '1 1 200px', padding: '0.8rem 1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', background: 'var(--color-bg)', color: 'var(--color-text-main)' }}
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {paginatedProducts.length === 0 ? (
        <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
          Không tìm thấy sản phẩm nào.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {paginatedProducts.map(product => {
            const displayImage = product.images?.[0] || '/images/cue_1.png';
            const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
            
            return (
              <div key={product.id} style={{ backgroundColor: 'var(--color-bg-light)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'relative' }}>
                <div style={{ position: 'relative', paddingTop: '100%' }}>
                  <img src={displayImage} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.5rem' }}>
                    <Link 
                      href={`/admin/edit/${product.id}`}
                      style={{ backgroundColor: '#1890ff', color: 'white', textDecoration: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                      title="Sửa sản phẩm"
                    >
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDuplicate(product)}
                      style={{ backgroundColor: '#52c41a', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                      title="Nhân bản sản phẩm"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-light)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</span>
                  <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>{formattedPrice}</div>
                </div>
              </div>
            );
          })}
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
      )}

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
