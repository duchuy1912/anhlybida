import { supabase } from '@/lib/supabaseClient';

export const revalidate = 60; // Cache 60 giây

export default async function AboutPage() {
  // Lấy nội dung từ database
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'about_page')
    .single();

  const content = data?.value || '<p>Nội dung giới thiệu đang được cập nhật...</p>';

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--color-primary-dark)' }}>
        Giới thiệu
      </h1>
      <div 
        className="about-content"
        style={{ margin: '0 auto', lineHeight: '1.8', fontSize: '1.1rem' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
