"use client";

import { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ProductOptions.module.css';

interface Shaft {
  name: string;
  price: number;
  isDefault?: boolean;
  image?: string;
  description?: string;
  specs?: string;
}

interface Upgrade {
  name: string;
  price: number;
}

interface ProductOptionsProps {
  basePrice: number;
  options: {
    shafts?: Shaft[];
    upgrades?: Upgrade[];
    allowEngraving?: boolean;
  };
  onTotalChange: (total: number, selectedOptions: any) => void;
}

export default function ProductOptions({ basePrice, options, onTotalChange }: ProductOptionsProps) {
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();
  
  const defaultShaft = options.shafts?.find(s => s.isDefault) || options.shafts?.[0];
  const [selectedShaft, setSelectedShaft] = useState<Shaft | null>(defaultShaft || null);
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([]);
  
  const [engravingText, setEngravingText] = useState('');
  const [engravingStyle, setEngravingStyle] = useState('Đơn giản');
  
  const [otherRequests, setOtherRequests] = useState('');

  const calculateEngravingPrice = (text: string) => {
    const len = text.trim().length;
    if (len === 0) return 0;
    if (len <= 20) return 100000;
    if (len <= 30) return 150000;
    return 150000; // Cap at 30 chars usually, but just in case
  };

  useEffect(() => {
    let total = basePrice;
    
    if (selectedShaft && selectedShaft.price) {
      total += selectedShaft.price;
    }
    
    selectedUpgrades.forEach(upgradeName => {
      const upgrade = options.upgrades?.find(u => u.name === upgradeName);
      if (upgrade && upgrade.price) {
        total += upgrade.price;
      }
    });

    if (options.allowEngraving) {
      total += calculateEngravingPrice(engravingText);
    }

    onTotalChange(total, {
      shaft: selectedShaft,
      upgrades: selectedUpgrades,
      engraving: options.allowEngraving && engravingText.trim() ? { text: engravingText, style: engravingStyle } : null,
      otherRequests
    });
  }, [selectedShaft, selectedUpgrades, engravingText, engravingStyle, otherRequests, basePrice, options]);

  if (!options || (!options.shafts?.length && !options.upgrades?.length && !options.allowEngraving)) {
    return null; // No options to show
  }

  const toggleUpgrade = (upgradeName: string) => {
    setSelectedUpgrades(prev => 
      prev.includes(upgradeName) 
        ? prev.filter(n => n !== upgradeName)
        : [...prev, upgradeName]
    );
  };

  return (
    <div className={styles.optionsContainer}>
      <h3 className={styles.optionsTitle}>{t('options').toUpperCase()}</h3>
      
      {options.shafts && options.shafts.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('shaftOptions')}</h4>
          <div className={styles.shaftsList}>
            {options.shafts.map((shaft, idx) => {
              const isSelected = selectedShaft?.name === shaft.name;
              const hasDetails = shaft.image || shaft.description || shaft.specs;
              
              return (
                <div key={idx} className={`${styles.shaftOptionWrapper} ${isSelected ? styles.selectedWrapper : ''}`}>
                  <label className={`${styles.shaftOption} ${isSelected ? styles.selected : ''}`}>
                    <div className={styles.shaftRadio}>
                      <input 
                        type="radio" 
                        name="shaft" 
                        checked={isSelected}
                        onChange={() => setSelectedShaft(shaft)}
                      />
                      <span>{shaft.name}</span>
                    </div>
                    <div className={styles.shaftPrice}>
                      {shaft.price > 0 ? `+${formatPrice(shaft.price)}` : shaft.price < 0 ? `-${formatPrice(Math.abs(shaft.price))}` : 'Gốc'}
                    </div>
                  </label>
                  
                  {isSelected && hasDetails && (
                    <div className={styles.shaftDetails}>
                      {shaft.image && (
                        <div className={styles.shaftImageContainer}>
                          <img src={shaft.image} alt={shaft.name} className={styles.shaftImage} />
                        </div>
                      )}
                      
                      {shaft.description && (
                        <details className={styles.shaftDetailsAccordion}>
                          <summary>Chi tiết & Mô tả ngọn cơ</summary>
                          <div className={styles.accordionContent}>
                            {shaft.description.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                          </div>
                        </details>
                      )}
                      
                      {shaft.specs && (
                        <details className={styles.shaftDetailsAccordion}>
                          <summary>Thông số kỹ thuật</summary>
                          <div className={styles.accordionContent}>
                            {shaft.specs.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                          </div>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {options.allowEngraving && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('engraving')}</h4>
          <input 
            type="text" 
            maxLength={30}
            placeholder={t('engravingPlaceholder')} 
            className={styles.input}
            value={engravingText}
            onChange={(e) => setEngravingText(e.target.value)}
          />

          {engravingText.trim().length > 0 && (
            <div className={styles.engravingStyles}>
              <span className={styles.subLabel}>Kiểu chữ:</span>
              <label><input type="radio" name="fontStyle" checked={engravingStyle === 'Đơn giản'} onChange={() => setEngravingStyle('Đơn giản')} /> Đơn giản</label>
              <label><input type="radio" name="fontStyle" checked={engravingStyle === 'Phong cách'} onChange={() => setEngravingStyle('Phong cách')} /> Phong cách</label>
            </div>
          )}
        </div>
      )}

      {options.upgrades && options.upgrades.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('upgrades')}</h4>
          <div className={styles.upgradesList}>
            {options.upgrades.map((upgrade, idx) => (
              <label key={idx} className={styles.upgradeOption}>
                <div className={styles.upgradeCheckbox}>
                  <input 
                    type="checkbox" 
                    checked={selectedUpgrades.includes(upgrade.name)}
                    onChange={() => toggleUpgrade(upgrade.name)}
                  />
                  <span>{upgrade.name}</span>
                </div>
                <div className={styles.upgradePrice}>
                  +{formatPrice(upgrade.price)}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>{t('otherReqs')}</h4>
        <textarea 
          className={styles.textarea}
          placeholder="..."
          value={otherRequests}
          onChange={(e) => setOtherRequests(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
