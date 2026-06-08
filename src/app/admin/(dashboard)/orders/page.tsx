"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [mounted, setMounted] = useState(false);
  const [newOrderToast, setNewOrderToast] = useState<any>(null);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchOrders();
    // Khôi phục tab từ localStorage
    try {
      const savedTab = localStorage.getItem('adminOrdersTab');
      if (savedTab === 'active' || savedTab === 'history') {
        setActiveTab(savedTab);
      }
    } catch {}

    // Lắng nghe realtime từ bảng orders
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new;
          // Phát âm thanh
          try {
            const audio = new Audio('/notification.wav');
            audio.play().catch(e => console.log('Autoplay prevented', e));
          } catch (e) {}

          // Hiện thông báo
          setNewOrderToast(newOrder);
          setTimeout(() => setNewOrderToast(null), 5000);

          // Cập nhật danh sách
          setOrders(prev => [newOrder, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleTabChange = (tab: 'active' | 'history') => {
    setActiveTab(tab);
    try {
      localStorage.setItem('adminOrdersTab', tab);
    } catch {}
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Lỗi cập nhật trạng thái: ' + error.message);
    } else {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  if (loading) return <div>Đang tải danh sách đơn hàng...</div>;

  const activeOrders = orders.filter(o => ['pending', 'processing', 'shipping'].includes(o.status));
  const historyOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status));
  const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#52c41a'; // xanh lá
      case 'shipping': return '#1890ff';  // xanh dương
      case 'processing': return '#722ed1'; // tím
      case 'cancelled': return '#f5222d'; // đỏ
      default: return '#faad14'; // vàng (pending)
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <style>{`
        @keyframes toastSlideDown {
          from { top: -50px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }
      `}</style>

      {newOrderToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#34a853',
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
          🚨 CÓ ĐƠN HÀNG MỚI TỪ: {newOrderToast.customer_name?.toUpperCase() || 'KHÁCH HÀNG'}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', margin: 0 }}>Quản lý Đơn hàng</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: 'var(--color-bg-light)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => handleTabChange('active')}
            style={{ padding: '8px 16px', border: 'none', background: activeTab === 'active' ? 'var(--color-accent)' : 'transparent', color: activeTab === 'active' ? 'var(--color-primary-dark)' : 'var(--color-text-main)', borderRadius: '6px', fontWeight: activeTab === 'active' ? 'bold' : 'normal', cursor: 'pointer', boxShadow: activeTab === 'active' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}
          >
            Đơn hiện tại ({activeOrders.length})
          </button>
          <button 
            onClick={() => handleTabChange('history')}
            style={{ padding: '8px 16px', border: 'none', background: activeTab === 'history' ? 'var(--color-accent)' : 'transparent', color: activeTab === 'history' ? 'var(--color-primary-dark)' : 'var(--color-text-main)', borderRadius: '6px', fontWeight: activeTab === 'history' ? 'bold' : 'normal', cursor: 'pointer', boxShadow: activeTab === 'history' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}
          >
            Lịch sử ({historyOrders.length})
          </button>
        </div>
      </div>
      
      {displayedOrders.length === 0 ? (
        <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg-light)', borderRadius: '8px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Không có đơn hàng nào trong mục này.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {displayedOrders.map(order => (
            <div key={order.id} style={{ backgroundColor: 'var(--color-bg-light)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(150,150,150,0.1)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>Đơn hàng #{order.id.substring(0,8)}</h3>
                    <span style={{ backgroundColor: getStatusColor(order.status), color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {(!order.payment_method || order.payment_method === 'cod') ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-main)', fontSize: '0.95rem' }}>Thông tin khách hàng</h4>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                    <p style={{ margin: '0 0 4px 0' }}><strong>{order.customer_info?.fullName}</strong></p>
                    <p style={{ margin: '0 0 4px 0' }}>{order.customer_info?.phone}</p>
                    <p style={{ margin: '0 0 4px 0' }}>{order.customer_info?.email}</p>
                    <p style={{ margin: '0 0 4px 0', color: 'var(--color-text-muted)' }}>{order.customer_info?.address}</p>
                    {order.customer_info?.notes && (
                      <p style={{ margin: '8px 0 0 0', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontStyle: 'italic' }}>
                        Ghi chú: {order.customer_info.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-main)', fontSize: '0.95rem' }}>Trạng thái đơn hàng</h4>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontWeight: 'bold', 
                      color: getStatusColor(order.status), backgroundColor: '#fff', cursor: 'pointer'
                    }}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Khách hàng</h3>
                  <p style={{ margin: '0.2rem 0', color: 'var(--color-text-muted)' }}><strong>Tên:</strong> {order.customer_name}</p>
                  <p style={{ margin: '0.2rem 0', color: 'var(--color-text-muted)' }}><strong>SĐT:</strong> {order.phone_number || order.phone}</p>
                  <p style={{ margin: '0.2rem 0', color: 'var(--color-text-muted)' }}><strong>Địa chỉ:</strong> {order.shipping_address || order.address}</p>
                  {order.notes && <p style={{ margin: '0.2rem 0', color: '#ff4d4f' }}><strong>Ghi chú:</strong> {order.notes}</p>}
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Chi tiết Đơn ({order.items.length} SP)</h3>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--color-text-muted)' }}>
                    {order.items.map((item: any, idx: number) => (
                      <li key={item.cartItemId || item.id || idx} style={{ marginBottom: '0.5rem' }}>
                        <div>
                          {item.name} {item.category && <span style={{fontSize: '0.85em', color: '#666'}}>({item.category})</span>} <strong>x{item.quantity}</strong>
                        </div>
                        {item.selectedOptions && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            {item.selectedOptions.shaft && <div>- Ngọn: {item.selectedOptions.shaft.name}</div>}
                            {item.selectedOptions.upgrades && item.selectedOptions.upgrades.length > 0 && <div>- Nâng cấp: {item.selectedOptions.upgrades.join(', ')}</div>}
                            {item.selectedOptions.engraving && <div>- Khắc: "{item.selectedOptions.engraving.text}" ({item.selectedOptions.engraving.style})</div>}
                            {item.selectedOptions.otherRequests && <div>- Yêu cầu khác: {item.selectedOptions.otherRequests}</div>}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                    Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
