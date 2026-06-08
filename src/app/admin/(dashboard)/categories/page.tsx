"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Edit2, Plus, Save, X } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    
    const slug = generateSlug(newName);
    
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newName, slug })
      .select()
      .single();
      
    if (error) {
      alert('Lỗi khi thêm danh mục: ' + error.message);
    } else {
      setCategories([data, ...categories]);
      setNewName('');
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục: ${name}?\nLưu ý: Bạn nên xóa hoặc chuyển danh mục các sản phẩm thuộc danh mục này trước.`)) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) {
        alert('Lỗi khi xóa: ' + error.message);
      } else {
        setCategories(categories.filter(c => c.id !== id));
      }
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleUpdate = async () => {
    if (!editName.trim() || !editingId) return;
    
    const slug = generateSlug(editName);
    
    const { error } = await supabase
      .from('categories')
      .update({ name: editName, slug })
      .eq('id', editingId);
      
    if (error) {
      alert('Lỗi khi cập nhật: ' + error.message);
    } else {
      setCategories(categories.map(c => c.id === editingId ? { ...c, name: editName, slug } : c));
      setEditingId(null);
    }
  };

  if (loading) return <div>Đang tải danh sách danh mục...</div>;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)', margin: 0 }}>Quản lý Danh mục</h1>
        <button 
          onClick={() => setIsAdding(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
        >
          <Plus size={18} /> Thêm Danh mục
        </button>
      </div>

      {isAdding && (
        <div style={{ padding: '1.5rem', border: '1px solid #1890ff', borderRadius: '8px', marginBottom: '1.5rem', backgroundColor: '#e6f7ff', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên danh mục mới (VD: Cơ 4 băng, Bao da...)"
            style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
            autoFocus
          />
          <button onClick={handleAdd} style={{ padding: '0.8rem 1.5rem', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Lưu
          </button>
          <button onClick={() => setIsAdding(false)} style={{ padding: '0.8rem 1.5rem', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
            Hủy
          </button>
        </div>
      )}

      {categories.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Chưa có danh mục nào.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(150,150,150,0.2)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Tên Danh Mục</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Đường dẫn (Slug)</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid rgba(150,150,150,0.1)' }}>
                <td style={{ padding: '1rem' }}>
                  {editingId === cat.id ? (
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ padding: '0.5rem', width: '100%', background: 'var(--color-bg)', color: 'var(--color-text-main)', border: '1px solid #ccc' }}
                    />
                  ) : (
                    <strong style={{ color: 'var(--color-text-main)' }}>{cat.name}</strong>
                  )}
                </td>
                <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                  {editingId === cat.id ? 'Tự động tạo...' : cat.slug}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {editingId === cat.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={handleUpdate} style={{ padding: '0.4rem', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Save size={16} /></button>
                      <button onClick={() => setEditingId(null)} style={{ padding: '0.4rem', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}><X size={16} /></button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => startEdit(cat)} style={{ padding: '0.4rem', backgroundColor: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} style={{ padding: '0.4rem', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
