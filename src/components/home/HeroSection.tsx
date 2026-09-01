"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./HeroSection.module.css";

const defaultSlides = [
  {
    id: 1,
    title: "CÆ¡ Lá»— Cao Cáº¥p",
    subtitle: "Giáº£m giĂ¡ 20% cho dĂ²ng cÆ¡ lá»— má»›i nháº¥t nháº­p kháº©u tá»« Má»¹",
    image: "/images/cue_1.png",
    link: "/shop?category=co-lo"
  },
  {
    id: 2,
    title: "Anhly Bida",
    subtitle: "Kháº³ng Ä‘á»‹nh phong cĂ¡ch vĂ  Ä‘áº³ng cáº¥p trĂªn tá»«ng Ä‘Æ°á»ng cÆ¡",
    image: "/images/balls_1.png",
    link: "/shop"
  },
  {
    id: 3,
    title: "Phá»¥ Kiá»‡n ChĂ­nh HĂ£ng",
    subtitle: "Bao da, lÆ¡, Ä‘áº§u cÆ¡ chuáº©n quá»‘c táº¿ dĂ nh riĂªng cho dĂ¢n chuyĂªn",
    image: "/images/chalk_1.png",
    link: "/shop?category=phu-kien"
  }
];

export default function HeroSection({ initialBanners = [] }: { initialBanners?: any[] }) {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    if (initialBanners && initialBanners.length > 0) {
      const mappedSlides = initialBanners.map((b: any) => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        image: b.image_url,
        link: b.link || "/shop"
      }));
      setSlides(mappedSlides);
    } else {
      setSlides(defaultSlides);
    }
  }, [initialBanners]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Tự động trượt mỗi 5 giây
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    // SSR skeleton - prevent layout shift
    return <section className={styles.hero} />;
  }

  return (
    <section className={styles.hero}>
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
        >
          <div className={styles.background}>
            <Image 
              src={slide.image} 
              alt={slide.title || "Banner"} 
              fill 
              style={{ objectFit: "cover" }} 
              priority={index === 0} 
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>{slide.title}</h1>
            <p className={styles.subtitle}>{slide.subtitle}</p>
            <Link href={slide.link} className={styles.cta}>
              {t("viewNow")}
            </Link>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className={styles.controls}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

