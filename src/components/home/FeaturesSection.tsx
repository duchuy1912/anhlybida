"use client";

import { Handshake, Wrench, ShieldCheck, Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './FeaturesSection.module.css';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function FeaturesSection() {
  const { language } = useLanguage();

  const isEn = language === 'EN';

  const features = [
    {
      id: 1,
      icon: <Handshake size={32} />,
      title: isEn ? "QUALITY" : "CHẤT LƯỢNG",
      text: isEn ? "Trusted by players" : "Nhiều cơ thủ đã tin dùng"
    },
    {
      id: 2,
      icon: <Wrench size={32} />,
      title: isEn ? "SERVICE" : "DỊCH VỤ",
      text: isEn ? "Professional and dedicated" : "Chuyên nghiệp và tận tâm"
    },
    {
      id: 3,
      icon: <ShieldCheck size={32} />,
      title: isEn ? "WARRANTY" : "BẢO HÀNH",
      text: isEn ? "Up to 3 years free warranty" : "Bảo hành miễn phí đến 3 năm"
    },
    {
      id: 4,
      icon: <Truck size={32} />,
      title: isEn ? "DELIVERY" : "GIAO HÀNG",
      text: isEn ? "Nationwide COD delivery" : "Ship COD trên toàn quốc"
    }
  ];

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.intro}>
          <h2 className={styles.title}>{isEn ? "WELCOME TO ANHLY BILLIARDS!" : "CHÀO MỪNG BẠN ĐẾN VỚI CƠ BIDA ANHLY!"}</h2>
          <p className={styles.description}>
            {isEn 
              ? "Specializing in the production of high-quality professional billiard cues, providing the best cue warranty service for players. In the journey to become a leading high-quality billiard cue brand in Vietnam, continuous improvement, research and practice is the guideline we aim for every day."
              : "Chuyên sản xuất dòng cơ bida chuyên nghiệp chất lượng cao, cung cấp dịch vụ bảo hành cơ tốt nhất cho cơ thủ. Trong hành trình phát triển để trở thành thương hiệu sản xuất cơ bida chất lượng cao hàng đầu Việt Nam, không ngừng cải tiến, nghiên cứu và thực nghiệm là kim chỉ nam mà chúng tôi hướng đến hàng ngày."
            }
          </p>
          <div className={styles.socials}>
            <a href="https://www.facebook.com/Anhlyreviewt/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="https://www.youtube.com/@anhlyreview8204" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Youtube">
              <YoutubeIcon />
            </a>
            <a href="https://www.tiktok.com/@anhlyreview" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Tiktok">
              <TiktokIcon />
            </a>
          </div>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={feature.id} className={`${styles.card} ${index < 2 ? styles.hideOnMobile : ''}`}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
