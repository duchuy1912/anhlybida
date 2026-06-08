"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import styles from './HeroSection.module.css';

const defaultSlides = [
  {
    id: 1,
    title: "Cơ Lỗ Cao Cấp",
    subtitle: "Giảm giá 20% cho dòng cơ lỗ mới nhất nhập khẩu từ Mỹ",
    image: "/images/cue_1.png",
    link: "/shop?category=co-lo"
  },
  {
    id: 2,
    title: "Anhly Bida",
    subtitle: "Khẳng định phong cách và đẳng cấp trên từng đường cơ",
    image: "/images/balls_1.png",
    link: "/shop"
  },
  {
    id: 3,
    title: "Phụ Kiện Chính Hãng",
    subtitle: "Bao da, lơ, đầu cơ chuẩn quốc tế dành riêng cho dân chuyên",
    image: "/images/chalk_1.png",
    link: "/shop?category=phu-kien"
  }
];

export default function HeroSection() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        // Map data db sang format slides
        const mappedSlides = data.map((b: any) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          image: b.image_url,
          link: b.link || '/shop'
        }));
        setSlides(mappedSlides);
      } else {
        setSlides(defaultSlides);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Tự động trượt mỗi 5 giây
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className={styles.hero}>
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
        >
          <div 
            className={styles.background} 
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className={styles.content}>
            <h1 className={styles.title}>{slide.title}</h1>
            <p className={styles.subtitle}>{slide.subtitle}</p>
            <Link href={slide.link} className={styles.cta}>
              {t('viewNow')}
            </Link>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className={styles.controls}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
