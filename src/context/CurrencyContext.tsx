"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'VND' | 'USD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceVnd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Hardcoded exchange rates based on VND as base
const EXCHANGE_RATES: Record<Currency, number> = {
  VND: 1,
  USD: 25400, // 1 USD = 25,400 VND
  EUR: 27500, // 1 EUR = 27,500 VND
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>('VND');

  useEffect(() => {
    // Load from localStorage if available
    const savedCurrency = localStorage.getItem('currency') as Currency;
    if (savedCurrency && ['VND', 'USD', 'EUR'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const formatPrice = (priceVnd: number) => {
    const rate = EXCHANGE_RATES[currency];
    const convertedPrice = priceVnd / rate;

    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(convertedPrice);
    } else if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(convertedPrice);
    } else if (currency === 'EUR') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(convertedPrice);
    }
    
    return `${convertedPrice}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
