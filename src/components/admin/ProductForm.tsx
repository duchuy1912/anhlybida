"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from './ProductForm.module.css';

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    images: string[];
    specs: any;
  }
}

export default function ProductForm({ initialData }: ProductFormProps = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialData?.images || []);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };
  
  // Xử lý cấu trúc specs mới (có color, shafts, upgrades) hoặc cấu trúc cũ (chỉ là mảng)
  const isOldSpecsFormat = Array.isArray(initialData?.specs);
  const parsedOptions: any = isOldSpecsFormat ? {} : (initialData?.specs || {});
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '', 
    category: initialData?.category || '', 
    price: initialData?.price?.toString() || '', 
    description: initialData?.description || '',
    color: parsedOptions.color || '',
    allowEngraving: parsedOptions.allowEngraving || false,
    videoUrl: parsedOptions.videoUrl || ''
  });
  
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableShafts, setAvailableShafts] = useState<{name: string, price: number}[]>([]);
  const [shafts, setShafts] = useState<any[]>(parsedOptions.shafts || [{ name: 'Ngọn mộc', price: 0, isDefault: true }]);
  const [upgrades, setUpgrades] = useState<any[]>(parsedOptions.upgrades || []);
  
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('specs')
      ]);
      
      if (catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data);
        if (!initialData?.category) {
          setFormData(prev => ({...prev, category: catRes.data[0].name}));
        }
      }
      
      // Lấy danh sách màu sắc và ngọn đã từng nhập
      if (prodRes.data) {
        const colors = new Set<string>();
        const shaftMap = new Map<string, number>();

        prodRes.data.forEach(p => {
          if (p.specs && !Array.isArray(p.specs)) {
            if (p.specs.color) {
              colors.add(p.specs.color);
            }
            if (p.specs.shafts && Array.isArray(p.specs.shafts)) {
              p.specs.shafts.forEach((s: any) => {
                if (s.name && !shaftMap.has(s.name)) {
                  shaftMap.set(s.name, s.price || 0);
                }
              });
            }
          }
        });
        setAvailableColors(Array.from(colors));
        setAvailableShafts(Array.from(shaftMap.entries()).map(([name, price]) => ({ name, price })));
      }
    };
    fetchData();
  }, [initialData]);

  const initialSpecs = isOldSpecsFormat && initialData?.specs?.length > 0 
    ? initialData.specs 
    : (parsedOptions.attributes || [{ name: '', value: '' }]);
    
  const [specs, setSpecs] = useState(initialSpecs);

  const handleAddSpec = () => {
    setSpecs([...specs, { name: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  const handleSpecChange = (index: number, field: 'name' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // KIỂM TRA LOGIC: Tối đa 10 ảnh
      if (images.length + newFiles.length > 10) {
        showToast('Chỉ được phép tải lên tối đa 10 hình ảnh cho mỗi sản phẩm!', 'error');
        return;
      }
      
      const combined = [...images, ...newFiles];
      setImages(combined);
      setPreviewUrls(combined.map(file => URL.createObjectURL(file)));
    }
  };

  const removeImage = (index: number) => {
    // Nếu ảnh này là ảnh cũ (URL string)
    if (index < existingImages.length) {
      const newExisting = [...existingImages];
      newExisting.splice(index, 1);
      setExistingImages(newExisting);
    } else {
      // Nếu là ảnh mới up
      const newImagesIndex = index - existingImages.length;
      const newImages = [...images];
      newImages.splice(newImagesIndex, 1);
      setImages(newImages);
    }
    
    const newPreviews = [...previewUrls];
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload ảnh lên Storage
      const uploadedUrls: string[] = [];
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(data.publicUrl);
      }

      // 2. Lưu thông tin vào Table
      const validSpecs = specs.filter((s: any) => s.name.trim() !== '' && s.value.trim() !== '');
      const validShafts = shafts.filter((s: any) => s.name.trim() !== '');
      const validUpgrades = upgrades.filter((u: any) => u.name.trim() !== '');
      
      const productPayload = {
        name: formData.name,
        category: formData.category,
        price: parseInt(formData.price),
        description: formData.description,
        images: [...existingImages, ...uploadedUrls],
        specs: {
          attributes: validSpecs,
          color: formData.color,
          shafts: validShafts,
          upgrades: validUpgrades,
          allowEngraving: formData.allowEngraving,
          videoUrl: formData.videoUrl
        }
      };

      if (initialData?.id) {
        // Edit mode
        
        // 3. Dọn rác ảnh (Storage Leak Cleanup)
        const deletedImages = initialData.images?.filter((oldUrl: string) => !existingImages.includes(oldUrl)) || [];
        if (deletedImages.length > 0) {
          const filesToRemove = deletedImages.map((url: string) => {
            const parts = url.split('/');
            return parts.pop();
          }).filter(Boolean);
          
          if (filesToRemove.length > 0) {
            await supabase.storage.from('product-images').remove(filesToRemove);
          }
        }

        const { error: updateError } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', initialData.id);

        if (updateError) throw updateError;
        showToast('Đã cập nhật sản phẩm thành công!', 'success');
        setTimeout(() => router.push('/admin/products'), 1000);
      } else {
        // Add mode
        const { error: insertError } = await supabase
          .from('products')
          .insert(productPayload);

        if (insertError) throw insertError;
        showToast('Đã thêm sản phẩm thành công!', 'success');
        setTimeout(() => router.push('/admin/products'), 1000);
      }
      
    } catch (error: any) {
      console.error(error);
      showToast('Có lỗi xảy ra: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes toastSlideDown {
          from { top: -50px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }
      `}</style>
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: toast.type === 'success' ? '#34a853' : '#ea4335',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'toastSlideDown 0.3s ease-out'
        }}>
          {toast.type === 'success' ? '✓' : '⚠️'} {toast.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Tên sản phẩm *</label>
        <input required type="text" className={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Cơ Libre Mit Cao Cấp" />
      </div>
      
      <div className={styles.formGroup}>
        <label>Danh mục *</label>
        <select className={styles.select} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Giá bán (VNĐ) *</label>
        <input required type="number" className={styles.input} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="VD: 1500000" />
      </div>

      <div className={styles.formGroup}>
        <label>Màu sắc</label>
        <input 
          type="text" 
          list="color-options"
          className={styles.input} 
          value={formData.color} 
          onChange={e => setFormData({...formData, color: e.target.value})} 
          placeholder="VD: Đỏ đô, Xanh ngọc bích..." 
        />
        <datalist id="color-options">
          {availableColors.map((color, idx) => (
            <option key={idx} value={color} />
          ))}
        </datalist>
      </div>

      <div className={styles.formGroup}>
        <label>Hình ảnh (Tối đa 10 ảnh) *</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} disabled={images.length >= 10} className={styles.input} />
        <div className={styles.imageGrid}>
          {previewUrls.map((url, i) => (
            <div key={i} className={styles.imagePreview}>
              <img src={url} alt={`Preview ${i}`} />
              <button type="button" onClick={() => removeImage(i)} className={styles.removeBtn}>X</button>
            </div>
          ))}
        </div>
        <small style={{color: 'var(--color-text-muted)'}}>Đã tải lên: {images.length}/10 ảnh</small>
      </div>

      <div className={styles.formGroup}>
        <label>Link Video YouTube (Tùy chọn)</label>
        <input type="text" className={styles.input} value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
      </div>

      <div className={styles.formGroup}>
        <label>Mô tả chi tiết</label>
        <textarea className={styles.textarea} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Viết mô tả về sản phẩm..." />
      </div>

      <div className={styles.formGroup}>
        <label>Thông số kỹ thuật tùy chỉnh</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {specs.map((spec: any, index: number) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" className={styles.input} value={spec.name} onChange={e => handleSpecChange(index, 'name', e.target.value)} placeholder="Tên thông số (VD: Trọng lượng)" style={{ flex: 1 }} />
              <input type="text" className={styles.input} value={spec.value} onChange={e => handleSpecChange(index, 'value', e.target.value)} placeholder="Giá trị (VD: 450g)" style={{ flex: 2 }} />
              {specs.length > 1 && (
                <button type="button" onClick={() => handleRemoveSpec(index)} style={{ padding: '0 1rem', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddSpec} style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'var(--color-bg-light)', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem', color: 'var(--color-text-main)' }}>+ Thêm thông số</button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <h3 style={{ borderBottom: '1px solid rgba(150,150,150,0.2)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>Cấu hình Tùy chọn đặt hàng</h3>
        
        <label style={{ fontWeight: 'bold' }}>1. Tùy chọn Ngọn (Shafts)</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {shafts.map((shaft, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="text" className={styles.input} value={shaft.name} onChange={e => { const s = [...shafts]; s[index].name = e.target.value; setShafts(s); }} placeholder="Tên ngọn (VD: Ngọn mộc, Ngọn ghép 10)" style={{ flex: 2 }} />
              <input type="number" className={styles.input} value={shaft.price} onChange={e => { const s = [...shafts]; s[index].price = parseInt(e.target.value) || 0; setShafts(s); }} placeholder="Giá cộng thêm (VD: 1500000)" style={{ flex: 1 }} />
              <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                <input type="radio" checked={shaft.isDefault} onChange={() => { const s = [...shafts].map(x => ({...x, isDefault: false})); s[index].isDefault = true; setShafts(s); }} /> Mặc định
              </label>
              <button type="button" onClick={() => setShafts(shafts.filter((_, i) => i !== index))} style={{ padding: '0 1rem', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
            </div>
          ))}
          
          {availableShafts.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Gợi ý (Nhấp để thêm nhanh):</span>
              
              <button 
                type="button" 
                onClick={() => {
                  const newShafts = availableShafts.filter(s => !shafts.some(shaft => shaft.name.toLowerCase() === s.name.toLowerCase())).map(s => ({ name: s.name, price: s.price, isDefault: false }));
                  if (newShafts.length > 0) {
                    setShafts([...shafts, ...newShafts]);
                  }
                }}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem', background: 'var(--color-bg-light)', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-main)', fontWeight: 'bold' }}
              >
                + Chọn tất cả
              </button>

              {availableShafts.map((s, idx) => {
                const isAdded = shafts.some(shaft => shaft.name.toLowerCase() === s.name.toLowerCase());
                return (
                  <button 
                    type="button" 
                    key={idx} 
                    onClick={() => {
                      if (!isAdded) {
                        setShafts([...shafts, { name: s.name, price: s.price, isDefault: false }]);
                      }
                    }}
                    style={{ 
                      padding: '0.2rem 0.5rem', fontSize: '0.85rem', borderRadius: '4px', 
                      background: isAdded ? 'var(--color-bg-light)' : '#e6f7ff', 
                      border: isAdded ? '1px solid rgba(150,150,150,0.3)' : '1px solid #91d5ff', 
                      cursor: isAdded ? 'default' : 'pointer', 
                      color: isAdded ? 'var(--color-text-muted)' : '#0050b3' 
                    }}
                    disabled={isAdded}
                  >
                    {isAdded ? '✓' : '+'} {s.name} ({s.price > 0 ? `+${s.price.toLocaleString('vi-VN')}đ` : s.price < 0 ? `${s.price.toLocaleString('vi-VN')}đ` : '0đ'})
                  </button>
                );
              })}
            </div>
          )}

          <button type="button" onClick={() => setShafts([...shafts, { name: '', price: 0, isDefault: false }])} style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'var(--color-bg-light)', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem', color: 'var(--color-text-main)' }}>+ Thêm tùy chọn ngọn mới</button>
        </div>

        <label style={{ fontWeight: 'bold' }}>2. Các gói nâng cấp cán</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {upgrades.map((upgrade, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" className={styles.input} value={upgrade.name} onChange={e => { const u = [...upgrades]; u[index].name = e.target.value; setUpgrades(u); }} placeholder="Tên nâng cấp (VD: Lõi Premium, Ren Titanium)" style={{ flex: 2 }} />
              <input type="number" className={styles.input} value={upgrade.price} onChange={e => { const u = [...upgrades]; u[index].price = parseInt(e.target.value) || 0; setUpgrades(u); }} placeholder="Giá cộng thêm (VD: 2200000)" style={{ flex: 1 }} />
              <button type="button" onClick={() => setUpgrades(upgrades.filter((_, i) => i !== index))} style={{ padding: '0 1rem', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
            </div>
          ))}
          <button type="button" onClick={() => setUpgrades([...upgrades, { name: '', price: 0 }])} style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'var(--color-bg-light)', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-main)' }}>+ Thêm gói nâng cấp</button>
        </div>

        <label style={{ fontWeight: 'bold' }}>3. Khắc tên</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="allowEngraving" checked={formData.allowEngraving} onChange={e => setFormData({...formData, allowEngraving: e.target.checked})} />
          <label htmlFor="allowEngraving" style={{ margin: 0, fontWeight: 'normal' }}>Cho phép khách hàng khắc tên lên cơ (Tự động tính phí theo số ký tự)</label>
        </div>
      </div>

      <button type="submit" disabled={loading || (images.length === 0 && existingImages.length === 0)} className={styles.submitBtn}>
        {loading ? 'Đang xử lý...' : (initialData?.id ? 'LƯU THAY ĐỔI' : 'LƯU SẢN PHẨM MỚI')}
      </button>
    </form>
    </>
  );
}
