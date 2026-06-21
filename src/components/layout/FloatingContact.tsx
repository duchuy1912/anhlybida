"use client";

import { useState, useEffect } from 'react';
import styles from './FloatingContact.module.css';
import { Phone } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function FloatingContact() {
  const [mounted, setMounted] = useState(false);
  const [contactInfo, setContactInfo] = useState<any>({});

  useEffect(() => {
    setMounted(true);
    const fetchContact = async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'contact_info').single();
      if (data && data.value) {
        try {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setContactInfo(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchContact();
  }, []);

  if (!mounted) return null;

  const phone = contactInfo.phone || '0367755966';
  const formattedPhone = phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  const zaloUrl = contactInfo.zalo || (phone ? `https://zalo.me/${phone.replace(/\D/g, '')}` : 'https://zalo.me/0367755966');
  const facebookUrl = contactInfo.facebook || 'https://m.me/Anhlyreviewt';

  return (
    <div className={styles.container}>
      <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} aria-label="Zalo">
        <svg viewBox="0 0 100 100" className={styles.zaloSvg}>
          <circle cx="50" cy="50" r="50" fill="#0068FF"/>
          <text x="50" y="62" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="38" textAnchor="middle">Zalo</text>
        </svg>
        <span className={styles.tooltip}>Chat Zalo</span>
      </a>

      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} aria-label="Messenger">
        <svg viewBox="0 0 256 256" className={styles.messengerSvg}>
          <defs>
            <linearGradient id="messenger-gradient" x1="10.8%" x2="93.8%" y1="91.1%" y2="23.9%">
              <stop offset="0%" stopColor="#00B2FF"/>
              <stop offset="50%" stopColor="#A838FF"/>
              <stop offset="100%" stopColor="#FF5252"/>
            </linearGradient>
          </defs>
          <path fill="url(#messenger-gradient)" d="M128 0C55.3 0 0 51.6 0 119.8c0 38.6 18.2 72.3 46 94.6v41.6c0 4.2 4.4 6.8 8.1 4.8l43.2-22.9c9.5 2.7 19.6 4.1 30.7 4.1 72.7 0 128-51.6 128-119.8S200.7 0 128 0zm12.3 159.2l-32.3-34.6c-3-3.2-8.1-3.4-11.4-.4l-42.5 38.3c-4.8 4.3-11.3-1.8-7.7-7.2l39.2-59c2.8-4.2 8-5.3 12.1-2.5l32.2 21.8c2.9 2 6.8 1.9 9.6-.3l44.3-34.5c4.7-3.7 11.2 1.6 7.8 6.7l-40.4 68.7c-2.4 4.1-7.7 5.7-10.9 3z"/>
        </svg>
        <span className={styles.tooltip}>Messenger</span>
      </a>

      <a href={`tel:${phone.replace(/\D/g, '')}`} className={styles.callBtn} aria-label="Gọi điện">
        <div className={styles.callIconWrapper}>
          <Phone className={styles.callIcon} size={20} />
          <div className={styles.pulseRing}></div>
        </div>
        <div className={styles.callText}>
          <span className={styles.callLabel}>Gọi miễn phí</span>
          <strong className={styles.callNumber}>{formattedPhone}</strong>
        </div>
      </a>
    </div>
  );
}
