"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminAboutPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedImgRef = useRef<HTMLImageElement | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'about_page')
        .single();
        
      if (data) {
        setContent(data.value);
      }
      setLoading(false);
    };
    
    fetchContent();
  }, []);

  useEffect(() => {
    if (editorRef.current && !previewMode) {
      editorRef.current.innerHTML = content;
    }
  }, [loading, previewMode]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    syncContent();
  };

  const syncContent = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const uploadImageFile = async (file: File) => {
    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `about-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err: any) {
      showToast('Lỗi tải ảnh: ' + err.message, 'error');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    let hasImage = false;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        hasImage = true;
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const url = await uploadImageFile(file);
          if (url) {
            execCommand('insertImage', url);
          }
        }
        break; // Only handle the first image
      }
    }

    // Nếu không phải là dán ảnh, ép dán dưới dạng Plain Text để bỏ định dạng rác (màu nền, font chữ...)
    if (!hasImage) {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      // Dùng insertText để dán chữ thô
      document.execCommand('insertText', false, text);
      syncContent();
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImageFile(file);
      if (url) {
        if (selectedImgRef.current) {
          // Replace existing image src
          selectedImgRef.current.src = url;
          syncContent();
          selectedImgRef.current = null;
        } else {
          // Insert new image
          execCommand('insertImage', url);
        }
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      selectedImgRef.current = target as HTMLImageElement;
      fileInputRef.current?.click();
    } else {
      selectedImgRef.current = null;
    }
  };

  const triggerImageUpload = () => {
    selectedImgRef.current = null;
    fileInputRef.current?.click();
  };

  const insertLayout = (type: 'text-img' | 'img-text') => {
    const imgPlaceholder = `<img src="https://placehold.co/600x400?text=Thay+Anh" alt="placeholder" style="width:100%; border-radius: 8px;" />`;
    const textPlaceholder = `<p>Nhập nội dung vào đây...</p>`;

    const html = `
      <br/>
      <div class="about-row">
        <div class="about-col">
          ${type === 'text-img' ? textPlaceholder : imgPlaceholder}
        </div>
        <div class="about-col">
          ${type === 'text-img' ? imgPlaceholder : textPlaceholder}
        </div>
      </div>
      <br/>
    `;
    execCommand('insertHTML', html);
  };

  const insertLink = () => {
    const url = prompt('Nhập URL liên kết:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'about_page', value: content, updated_at: new Date().toISOString() });
        
      if (error) throw error;
      showToast('Đã lưu nội dung trang Giới thiệu thành công!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Có lỗi xảy ra khi lưu: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải nội dung...</div>;

  const toolbarBtnStyle: React.CSSProperties = {
    padding: '6px 10px',
    border: '1px solid rgba(150,150,150,0.3)',
    background: 'var(--color-bg-light)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    lineHeight: 1,
    minWidth: '32px',
    textAlign: 'center',
    color: 'var(--color-text-main)',
  };

  return (
    <div>
      <style>{`
        @keyframes toastSlideDown {
          from { top: -50px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }
        .rich-editor {
          min-height: 400px;
          padding: 1.5rem;
          border: 1px solid rgba(150,150,150,0.3);
          border-top: none;
          border-radius: 0 0 8px 8px;
          outline: none;
          font-size: 1rem;
          line-height: 1.8;
          color: var(--color-text-main);
          background: var(--color-bg);
        }
        .rich-editor:focus {
          border-color: #4096ff;
          box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
        }
        .rich-editor h1 { font-size: 2rem; margin: 1rem 0 0.5rem; font-weight: 700; }
        .rich-editor h2 { font-size: 1.5rem; margin: 1rem 0 0.5rem; font-weight: 600; }
        .rich-editor h3 { font-size: 1.2rem; margin: 0.75rem 0 0.5rem; font-weight: 600; }
        .rich-editor p { margin-bottom: 0.5rem; }
        .rich-editor ul, .rich-editor ol { margin: 0.5rem 0 0.5rem 1.5rem; }
        .rich-editor li { margin-bottom: 0.2rem; }
        .rich-editor ul li { list-style-type: disc; }
        .rich-editor ol li { list-style-type: decimal; }
        .rich-editor img { max-width: 100%; height: auto; border-radius: 6px; margin: 0.5rem 0; cursor: pointer; transition: opacity 0.2s; }
        .rich-editor img:hover { opacity: 0.8; box-shadow: 0 0 0 2px #1677ff; }
        .rich-editor blockquote { border-left: 4px solid #c4a470; padding: 0.5rem 1rem; margin: 0.5rem 0; background: var(--color-bg-light); }
        .rich-editor a { color: #1677ff; text-decoration: underline; }
        .rich-editor .about-row { display: flex; gap: 2rem; align-items: center; margin: 2rem 0; }
        .rich-editor .about-col { flex: 1; }
        @media (max-width: 768px) {
          .rich-editor .about-row { flex-direction: column !important; gap: 1rem; }
          .rich-editor .about-col { width: 100%; }
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
      
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Quản lý Trang Giới Thiệu</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
          Soạn thảo nội dung bằng các công cụ bên dưới. Bạn có thể <strong>copy và dán (paste) trực tiếp hình ảnh</strong> vào khung soạn thảo. Nhớ bấm <strong>"Lưu Thay Đổi"</strong> khi hoàn tất.
        </p>

        {/* Tabs: Soạn thảo / Xem trước */}
        <div style={{ display: 'flex', gap: '0', marginBottom: 0 }}>
          <button 
            onClick={() => setPreviewMode(false)}
            style={{ 
              padding: '8px 20px', border: '1px solid rgba(150,150,150,0.3)', borderBottom: previewMode ? '1px solid rgba(150,150,150,0.3)' : '1px solid var(--color-bg)',
              background: previewMode ? 'var(--color-bg-light)' : 'var(--color-bg)', borderRadius: '8px 8px 0 0', cursor: 'pointer',
              fontWeight: previewMode ? 400 : 700, fontSize: '0.9rem', position: 'relative', zIndex: 1, marginBottom: '-1px', color: 'var(--color-text-main)'
            }}
          >
            ✏️ Soạn thảo
          </button>
          <button 
            onClick={() => { syncContent(); setPreviewMode(true); }}
            style={{ 
              padding: '8px 20px', border: '1px solid rgba(150,150,150,0.3)', borderBottom: !previewMode ? '1px solid rgba(150,150,150,0.3)' : '1px solid var(--color-bg)',
              background: !previewMode ? 'var(--color-bg-light)' : 'var(--color-bg)', borderRadius: '8px 8px 0 0', cursor: 'pointer',
              fontWeight: !previewMode ? 400 : 700, fontSize: '0.9rem', position: 'relative', zIndex: 1, marginBottom: '-1px', color: 'var(--color-text-main)'
            }}
          >
            👁️ Xem trước
          </button>
        </div>

        {!previewMode ? (
          <>
            {/* Toolbar */}
            <div style={{ 
              display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '8px 12px',
              background: 'var(--color-bg-light)', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '0 8px 0 0',
              alignItems: 'center'
            }}>
              <select 
                onChange={(e) => { execCommand('formatBlock', e.target.value); e.target.value = ''; }}
                style={{ ...toolbarBtnStyle, minWidth: '100px' }}
                defaultValue=""
              >
                <option value="" disabled>Tiêu đề</option>
                <option value="h1">Tiêu đề 1</option>
                <option value="h2">Tiêu đề 2</option>
                <option value="h3">Tiêu đề 3</option>
                <option value="p">Văn bản</option>
              </select>
              <div style={{ width: '1px', height: '24px', background: 'rgba(150,150,150,0.3)', margin: '0 4px' }} />
              <button type="button" onClick={() => execCommand('bold')} style={{...toolbarBtnStyle, fontWeight: 'bold'}} title="In đậm">B</button>
              <button type="button" onClick={() => execCommand('italic')} style={{...toolbarBtnStyle, fontStyle: 'italic'}} title="In nghiêng">I</button>
              <button type="button" onClick={() => execCommand('underline')} style={{...toolbarBtnStyle, textDecoration: 'underline'}} title="Gạch chân">U</button>
              <button type="button" onClick={() => execCommand('strikeThrough')} style={{...toolbarBtnStyle, textDecoration: 'line-through'}} title="Gạch ngang">S</button>
              <div style={{ width: '1px', height: '24px', background: '#d9d9d9', margin: '0 4px' }} />
              <button type="button" onClick={() => execCommand('insertUnorderedList')} style={toolbarBtnStyle} title="Danh sách">• —</button>
              <button type="button" onClick={() => execCommand('insertOrderedList')} style={toolbarBtnStyle} title="Danh sách số">1.</button>
              <button type="button" onClick={() => execCommand('formatBlock', 'blockquote')} style={toolbarBtnStyle} title="Trích dẫn">❝</button>
              <div style={{ width: '1px', height: '24px', background: '#d9d9d9', margin: '0 4px' }} />
              <button type="button" onClick={insertLink} style={toolbarBtnStyle} title="Chèn liên kết">🔗</button>
              <button type="button" onClick={triggerImageUpload} style={toolbarBtnStyle} title="Tải ảnh lên (Hoặc Copy Paste ảnh)">🖼️</button>
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" style={{ display: 'none' }} />
              <div style={{ width: '1px', height: '24px', background: '#d9d9d9', margin: '0 4px' }} />
              <button type="button" onClick={() => execCommand('removeFormat')} style={toolbarBtnStyle} title="Xóa định dạng">✕</button>
              <div style={{ width: '1px', height: '24px', background: '#d9d9d9', margin: '0 4px' }} />
              <button type="button" onClick={() => insertLayout('text-img')} style={{...toolbarBtnStyle, color: '#1677ff'}} title="Khối: Trái chữ - Phải hình">[Chữ | Hình]</button>
              <button type="button" onClick={() => insertLayout('img-text')} style={{...toolbarBtnStyle, color: '#1677ff'}} title="Khối: Trái hình - Phải chữ">[Hình | Chữ]</button>
            </div>
            
            {/* Editor */}
            <div
              ref={editorRef}
              className="rich-editor"
              contentEditable
              onInput={syncContent}
              onBlur={syncContent}
              onPaste={handlePaste}
              onClick={handleEditorClick}
              suppressContentEditableWarning
            />
          </>
        ) : (
          <div 
            className="about-content"
            style={{ 
              minHeight: '400px', padding: '1.5rem', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '0 0 8px 8px',
              background: 'var(--color-bg)', lineHeight: '1.8', fontSize: '1rem', color: 'var(--color-text-main)'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
      
      <button 
        onClick={handleSave} 
        disabled={saving}
        style={{ 
          backgroundColor: '#1a1a1a', 
          color: 'white', 
          padding: '12px 28px', 
          borderRadius: '6px', 
          border: 'none',
          cursor: saving ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
          marginTop: '0.5rem'
        }}
      >
        {saving ? 'Đang lưu...' : '💾 LƯU THAY ĐỔI'}
      </button>
    </div>
  );
}
