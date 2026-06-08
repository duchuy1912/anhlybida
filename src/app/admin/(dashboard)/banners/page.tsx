"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Plus, Image as ImageIcon, Link as LinkIcon, Type } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    link: '/shop',
    file: null as File | null
  });

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBanners(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewBanner({ ...newBanner, file: e.target.files[0] });
    }
  };

  const handleAddBanner = async () => {
    if (!newBanner.file) {
      alert("Vui lòng chọn hình ảnh!");
      return;
    }
    if (banners.length >= 10) {
      alert("Đã đạt giới hạn tối đa 10 ảnh banner. Vui lòng xóa bớt trước khi thêm mới.");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload ảnh
      const fileExt = newBanner.file.name.split('.').pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, newBanner.file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 2. Lưu vào DB
      const { data, error } = await supabase
        .from('banners')
        .insert({
          image_url: publicUrlData.publicUrl,
          title: newBanner.title,
          subtitle: newBanner.subtitle,
          link: newBanner.link,
          display_order: banners.length + 1
        })
        .select()
        .single();

      if (error) throw error;

      setBanners([...banners, data]);
      setNewBanner({ title: '', subtitle: '', link: '/shop', file: null });
      // Reset file input
      const fileInput = document.getElementById('bannerFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      console.error(err);
      alert("Lỗi khi thêm banner: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa banner này?")) {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (!error) {
        setBanners(banners.filter(b => b.id !== id));
      } else {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Đang tải...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)', margin: 0 }}>Quản lý Banner</h1>
        <div style={{ color: 'var(--color-text-muted)' }}>
          Đã dùng: <strong>{banners.length}/10</strong> banner
        </div>
      </div>

      {banners.length < 10 && (
        <div style={{ background: 'var(--color-bg-light)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid rgba(150,150,150,0.3)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Thêm Banner mới
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tiêu đề (Tùy chọn)</label>
              <input 
                type="text" 
                placeholder="VD: Siêu khuyến mãi mùa hè"
                value={newBanner.title}
                onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '4px', background: 'var(--color-bg)', color: 'var(--color-text-main)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mô tả ngắn (Tùy chọn)</label>
              <input 
                type="text" 
                placeholder="VD: Giảm ngay 50% cho toàn bộ cơ bida"
                value={newBanner.subtitle}
                onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '4px', background: 'var(--color-bg)', color: 'var(--color-text-main)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Đường dẫn khi click (Tùy chọn)</label>
              <input 
                type="text" 
                placeholder="VD: /shop?category=co-lo"
                value={newBanner.link}
                onChange={e => setNewBanner({...newBanner, link: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '4px', background: 'var(--color-bg)', color: 'var(--color-text-main)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Hình ảnh (Bắt buộc) - Khuyến nghị: 1920x600px</label>
              <input 
                id="bannerFileInput"
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px dashed #1890ff', borderRadius: '4px', background: 'var(--color-bg)' }}
              />
            </div>
          </div>
          <button 
            onClick={handleAddBanner}
            disabled={uploading}
            style={{ marginTop: '1rem', padding: '0.8rem 2rem', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: uploading ? 'not-allowed' : 'pointer' }}
          >
            {uploading ? 'Đang tải lên...' : 'Thêm Banner'}
          </button>
        </div>
      )}

      {banners.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', border: '1px dashed rgba(150,150,150,0.3)', borderRadius: '8px' }}>
          Chưa có banner nào. Hệ thống sẽ hiển thị ảnh mặc định trên trang chủ.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {banners.map((banner, index) => (
            <div key={banner.id} style={{ display: 'flex', gap: '1.5rem', background: 'var(--color-bg)', border: '1px solid rgba(150,150,150,0.2)', padding: '1rem', borderRadius: '8px', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--color-bg-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>
                {index + 1}
              </div>
              <img 
                src={banner.image_url} 
                alt="Banner preview" 
                style={{ width: '240px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(150,150,150,0.3)' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}><Type size={14}/> {banner.title || '(Không có tiêu đề)'}</h4>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{banner.subtitle}</p>
                <a href={banner.link} target="_blank" style={{ color: '#1890ff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  <LinkIcon size={14} /> {banner.link}
                </a>
              </div>
              <button 
                onClick={() => handleDelete(banner.id)}
                style={{ padding: '0.8rem', background: 'rgba(255,77,79,0.1)', color: '#ff4d4f', border: '1px solid rgba(255,77,79,0.3)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
