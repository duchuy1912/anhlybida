"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function AdminContactPage() {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    zalo: '',
    map_url: '',
    faqs: [] as { question: string, answer: string }[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'contact_info')
        .single();
        
      if (data && data.value) {
        try {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setFormData({
            phone: parsed.phone || '',
            email: parsed.email || '',
            address: parsed.address || '',
            facebook: parsed.facebook || '',
            youtube: parsed.youtube || '',
            tiktok: parsed.tiktok || '',
            zalo: parsed.zalo || '',
            map_url: parsed.map_url || '',
            faqs: parsed.faqs || []
          });
        } catch (e) {
          console.error("Lỗi parse JSON:", e);
        }
      }
      setLoading(false);
    };
    
    fetchContent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '' }]
    });
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = [...formData.faqs];
    newFaqs.splice(index, 1);
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'contact_info', 
          value: JSON.stringify(formData), 
          updated_at: new Date().toISOString() 
        });
        
      if (error) throw error;
      showToast('Đã lưu thông tin trang Liên Hệ thành công!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Có lỗi xảy ra khi lưu: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải nội dung...</div>;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid rgba(150,150,150,0.3)',
    borderRadius: '6px',
    fontSize: '1rem',
    marginBottom: '1rem',
    background: 'var(--color-bg)',
    color: 'var(--color-text-main)'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    color: 'var(--color-text-main)'
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
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
      
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Quản lý Thông Tin Liên Hệ</h1>
      
      <div style={{ marginBottom: '1rem', background: 'var(--color-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(150,150,150,0.3)' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
          Nhập các thông tin liên hệ và đường dẫn mạng xã hội bên dưới. Các biểu tượng trên trang web sẽ tự động liên kết tới các đường dẫn này.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-accent)', borderBottom: '2px solid rgba(150,150,150,0.2)', paddingBottom: '0.5rem' }}>Thông tin Cơ bản</h3>
            <label style={labelStyle}>Số điện thoại Hotline</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="Ví dụ: 036 775 5966" />
            
            <label style={labelStyle}>Địa chỉ Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="Ví dụ: hotro@anhlybida.com" />
            
            <label style={labelStyle}>Địa chỉ Cửa hàng</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} placeholder="Nhập địa chỉ đầy đủ..." />
            
            <label style={labelStyle}>Bản đồ Google Maps (Link dẫn đường)</label>
            <input type="text" name="map_url" value={formData.map_url} onChange={handleChange} style={inputStyle} placeholder="Ví dụ: https://maps.app.goo.gl/..." />
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-accent)', borderBottom: '2px solid rgba(150,150,150,0.2)', paddingBottom: '0.5rem' }}>Mạng Xã Hội & Chat</h3>
            <div style={{ display: 'none' }}>
              <label style={labelStyle}>Đường dẫn (Link) Zalo</label>
              <input type="text" name="zalo" value={formData.zalo} onChange={handleChange} style={inputStyle} placeholder="Ví dụ: https://zalo.me/0367755966" />
            </div>
            
            <label style={labelStyle}>Đường dẫn (Link) Facebook Messenger</label>
            <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} style={inputStyle} placeholder="Ví dụ: https://m.me/Anhlyreviewt" />
            
            <label style={labelStyle}>Đường dẫn (Link) Youtube</label>
            <input type="text" name="youtube" value={formData.youtube} onChange={handleChange} style={inputStyle} placeholder="https://youtube.com/..." />
            
            <label style={labelStyle}>Đường dẫn (Link) TikTok</label>
            <input type="text" name="tiktok" value={formData.tiktok} onChange={handleChange} style={inputStyle} placeholder="https://tiktok.com/..." />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', background: 'var(--color-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(150,150,150,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid rgba(150,150,150,0.2)', paddingBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-accent)', margin: 0 }}>Câu Hỏi Thường Gặp (FAQ)</h3>
          <button 
            onClick={handleAddFaq}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e6f7ff', color: '#0050b3', border: '1px solid #91d5ff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            <PlusCircle size={16} /> Thêm Câu Hỏi
          </button>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Thêm các câu hỏi phổ biến mà khách hàng hay hỏi, kèm theo câu trả lời để tiết kiệm thời gian tư vấn. Những câu hỏi này sẽ xuất hiện trong Popup Hỗ Trợ.
        </p>

        {formData.faqs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-light)', borderRadius: '8px', border: '1px dashed rgba(150,150,150,0.3)' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>Chưa có câu hỏi nào. Bấm "Thêm Câu Hỏi" để bắt đầu.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {formData.faqs.map((faq, index) => (
              <div key={index} style={{ background: 'var(--color-bg-light)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(150,150,150,0.2)', position: 'relative' }}>
                <button 
                  onClick={() => handleRemoveFaq(index)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}
                  title="Xóa câu hỏi này"
                >
                  <Trash2 size={18} />
                </button>
                <label style={{...labelStyle, fontSize: '0.9rem'}}>Câu hỏi {index + 1}</label>
                <input 
                  type="text" 
                  value={faq.question} 
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)} 
                  style={{...inputStyle, padding: '8px 10px'}} 
                  placeholder="Ví dụ: Shop có giao hàng toàn quốc không?" 
                />
                
                <label style={{...labelStyle, fontSize: '0.9rem', marginTop: '0.5rem'}}>Câu trả lời</label>
                <textarea 
                  value={faq.answer} 
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} 
                  style={{...inputStyle, padding: '8px 10px', minHeight: '80px', marginBottom: 0, resize: 'vertical'}} 
                  placeholder="Ví dụ: Shop giao hàng tận nơi trên toàn quốc, thanh toán khi nhận hàng..." 
                />
              </div>
            ))}
          </div>
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
          marginBottom: '2rem'
        }}
      >
        {saving ? 'Đang lưu...' : '💾 LƯU TẤT CẢ THAY ĐỔI'}
      </button>
    </div>
  );
}
