"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('password', password);

    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push('/admin/orders');
      router.refresh();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '50%' }}>
            <Lock size={32} color="var(--color-primary-dark)" />
          </div>
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Quản trị hệ thống</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Vui lòng nhập mật khẩu để truy cập</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..." 
              required
              style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
            />
            {error && <p style={{ color: '#ff4d4f', fontSize: '0.9rem', marginTop: '0.5rem', margin: 0 }}>{error}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '1rem', backgroundColor: 'var(--color-primary-dark)', 
              color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', 
              fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          Gợi ý: Mật khẩu mặc định là <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}
