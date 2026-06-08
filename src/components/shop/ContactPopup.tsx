"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, Phone, HelpCircle, MapPin, X, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import styles from './ContactPopup.module.css';

interface FAQ {
  question: string;
  answer: string;
}

interface ContactInfo {
  phone?: string;
  zalo?: string;
  facebook?: string;
  map_url?: string;
  faqs?: FAQ[];
}

export default function ContactPopup({ 
  contactInfo = {}, 
  customTrigger 
}: { 
  contactInfo?: ContactInfo, 
  customTrigger?: React.ReactNode 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const phone = contactInfo.phone || '0367755966';
  const zalo = phone ? 'https://zalo.me/' + phone.replace(/\D/g, '') : 'https://zalo.me/0367755966';
  const facebook = contactInfo.facebook || 'https://m.me/Anhlyreviewt';
  const mapUrl = contactInfo.map_url || 'https://maps.google.com';
  const faqs = contactInfo.faqs || [];

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setShowFAQ(false);
      setOpenFaqIndex(null);
    }, 300); // reset state after close animation
  };

  return (
    <>
      {customTrigger ? (
        <div onClick={() => setIsOpen(true)} style={{ display: 'inline-flex', width: '100%', height: '100%', justifyContent: 'center' }}>
          {customTrigger}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className={styles.triggerButton}
        >
          Liên Hệ Tư Vấn
        </button>
      )}

      {mounted && isOpen && createPortal(
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.popup} onClick={e => e.stopPropagation()}>
            <div className={styles.header}>
              {showFAQ ? (
                <button onClick={() => setShowFAQ(false)} className={styles.backBtn}>
                  <ArrowLeft size={18} /> Quay lại
                </button>
              ) : (
                <h3>Hỗ trợ khách hàng</h3>
              )}
              <button onClick={handleClose} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            {showFAQ ? (
              <div className={styles.faqList}>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Các câu hỏi phổ biến</h4>
                {faqs.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', margin: '2rem 0' }}>Chưa có câu hỏi nào được thêm.</p>
                ) : (
                  faqs.map((faq, index) => (
                    <div key={index} className={styles.faqItem}>
                      <button 
                        className={styles.faqQuestion} 
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      >
                        {faq.question}
                        {openFaqIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {openFaqIndex === index && (
                        <div className={styles.faqAnswer}>
                          {faq.answer.split('\n').map((line, i) => (
                            <p key={i} style={{ margin: 0, marginBottom: '4px' }}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className={styles.options}>
                <a href={facebook} target="_blank" rel="noopener noreferrer" className={styles.option}>
                  <div className={styles.iconWrap} style={{ background: 'linear-gradient(135deg, #a259ff, #6c5ce7)' }}>
                    <MessageCircle size={22} color="white" />
                  </div>
                  <div className={styles.optionInfo}>
                    <strong>Chat trên Messenger</strong>
                    <span>Nhắn vào đây để bắt đầu</span>
                  </div>
                </a>

                <a href={zalo} target="_blank" rel="noopener noreferrer" className={styles.option}>
                  <div className={styles.iconWrap} style={{ background: 'linear-gradient(135deg, #0068ff, #00a1f1)' }}>
                    <MessageCircle size={22} color="white" />
                  </div>
                  <div className={styles.optionInfo}>
                    <strong>Chat trên Zalo</strong>
                    <span>Nhắn vào đây để bắt đầu</span>
                  </div>
                </a>

                <a href={`tel:${phone.replace(/\s+/g, '')}`} className={styles.option}>
                  <div className={styles.iconWrap} style={{ background: 'linear-gradient(135deg, #27ae60, #2ecc71)' }}>
                    <Phone size={22} color="white" />
                  </div>
                  <div className={styles.optionInfo}>
                    <strong>Gọi hotline {phone}</strong>
                    <span>Từ 8h sáng đến 8h tối</span>
                  </div>
                </a>

                <button onClick={() => setShowFAQ(true)} className={styles.option}>
                  <div className={styles.iconWrap} style={{ background: 'linear-gradient(135deg, #636e72, #b2bec3)' }}>
                    <HelpCircle size={22} color="white" />
                  </div>
                  <div className={styles.optionInfo}>
                    <strong>Câu hỏi thường gặp</strong>
                    <span>Một số câu hỏi khi lựa chọn cơ bida</span>
                  </div>
                </button>

                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.option}>
                  <div className={styles.iconWrap} style={{ background: 'linear-gradient(135deg, #e74c3c, #fd79a8)' }}>
                    <MapPin size={22} color="white" />
                  </div>
                  <div className={styles.optionInfo}>
                    <strong>Vị trí xưởng cơ</strong>
                    <span>Xem bản đồ chỉ đường</span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
