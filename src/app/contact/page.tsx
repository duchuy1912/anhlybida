import { supabase } from '@/lib/supabaseClient';
import { Phone, Mail, MapPin } from 'lucide-react';
import styles from './page.module.css';

export const revalidate = 60; // Cache 60 giây

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4a470" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4a470" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4a470" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

const ZaloIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4a470" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const MapSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4a470" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default async function ContactPage() {
  // Lấy nội dung cấu trúc từ database
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'contact_info')
    .single();

  let contactInfo = {
    phone: '036 775 5966',
    email: 'hotro@anhlybida.com',
    address: 'Đang cập nhật...',
    facebook: '#',
    youtube: '#',
    tiktok: '#',
    zalo: '#',
    map_url: '#',
    faqs: []
  } as any;

  if (data && data.value) {
    try {
      const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      contactInfo = { ...contactInfo, ...parsed };
    } catch (e) {
      console.error("Lỗi đọc cấu trúc Liên hệ:", e);
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', color: 'var(--color-primary-dark)' }}>
        Liên hệ với chúng tôi
      </h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Khối Thông tin Cơ bản */}
          <div className={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className={styles.iconWrap}>
              <Phone size={24} />
            </div>
            <div>
              <p className={styles.label}>Hotline Tư vấn</p>
              <p className={styles.value}>{contactInfo.phone}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className={styles.iconWrap}>
              <Mail size={24} />
            </div>
            <div>
              <p className={styles.label}>Địa chỉ Email</p>
              <p className={styles.value}>{contactInfo.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className={styles.iconWrap}>
              <MapPin size={24} />
            </div>
            <div>
              <p className={styles.label}>Địa chỉ Cửa hàng</p>
              <p className={styles.value} style={{ lineHeight: '1.4' }}>{contactInfo.address}</p>
            </div>
          </div>
        </div>

        {/* Khối Mạng Xã Hội */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <h3 className={styles.socialTitle}>
            Kết nối với Bida Anh Lý qua
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {contactInfo.facebook && (
              <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="social-btn" title="Facebook">
                <FacebookIcon />
              </a>
            )}
            
            {contactInfo.youtube && (
              <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer" className="social-btn" title="Youtube">
                <YoutubeIcon />
              </a>
            )}

            {contactInfo.tiktok && (
              <a href={contactInfo.tiktok} target="_blank" rel="noopener noreferrer" className="social-btn" title="TikTok">
                <TikTokIcon />
              </a>
            )}

            {contactInfo.zalo && (
              <a href={contactInfo.zalo} target="_blank" rel="noopener noreferrer" className="social-btn" title="Zalo">
                <ZaloIcon />
              </a>
            )}

            {contactInfo.map_url && (
              <a href={contactInfo.map_url} target="_blank" rel="noopener noreferrer" className="social-btn" title="Bản đồ đường đi">
                <MapSVG />
              </a>
            )}
          </div>
        </div>

        {/* Khối FAQ */}
        {contactInfo.faqs && contactInfo.faqs.length > 0 && (
          <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
              Câu hỏi thường gặp
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contactInfo.faqs.map((faq: any, index: number) => (
                <details key={index} className={styles.faqDetails}>
                  <summary className={styles.faqSummary}>
                    {faq.question}
                  </summary>
                  <div className={styles.faqAnswer}>
                    {faq.answer.split('\n').map((line: string, i: number) => (
                      <p key={i} style={{ margin: 0, marginBottom: '0.5rem' }}>{line}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
