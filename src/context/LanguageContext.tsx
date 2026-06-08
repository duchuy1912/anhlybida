"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'VI' | 'EN';

// Simple dictionary for UI elements
const translations = {
  VI: {
    home: "Trang chủ",
    shop: "Cửa hàng",
    about: "Giới thiệu",
    contact: "Liên hệ",
    search: "Tìm kiếm...",
    categories: "Danh mục",
    all: "Tất Cả",
    cart: "Giỏ hàng",
    addToCart: "Thêm Vào Giỏ Hàng",
    buyNow: "Mua Ngay",
    total: "Tổng cộng",
    checkout: "Thanh toán",
    emptyCart: "Giỏ hàng trống",
    price: "Giá",
    color: "Màu sắc",
    details: "Mô tả chi tiết",
    options: "Tùy chọn đặt hàng",
    shaftOptions: "Chọn ngọn cơ",
    engraving: "Khắc tên riêng",
    engravingPlaceholder: "Nhập tên muốn khắc...",
    upgrades: "Nâng cấp cán",
    otherReqs: "Yêu cầu khác",
    showing: "Hiển thị",
    products: "sản phẩm",
    filter: "Bộ lọc",
    clear: "Xóa",
    noProducts: "Không tìm thấy sản phẩm nào.",
    contactAdvice: "Liên hệ tư vấn",
    viewAll: "Xem Tất Cả",
    featured: "Nổi Bật",
    noProductsHome: "Chưa có sản phẩm nào!",
    goToAdmin: "Đi tới trang Admin",
    checkoutDetails: "Thông tin giao hàng",
    fullName: "Họ và tên *",
    phone: "Số điện thoại *",
    province: "Tỉnh/Thành phố *",
    district: "Quận/Huyện *",
    ward: "Phường/Xã *",
    address: "Số nhà, Tên đường *",
    orderNotes: "Ghi chú đơn hàng",
    paymentMethod: "Phương thức thanh toán",
    cod: "Thanh toán khi nhận hàng (COD)",
    codDesc: "Khách hàng nhận hàng, kiểm tra hàng và thanh toán trực tiếp cho nhân viên giao hàng.",
    yourOrder: "Đơn hàng của bạn",
    shippingFee: "Phí vận chuyển",
    freeTemp: "Miễn phí (Tạm thời)",
    confirmOrder: "XÁC NHẬN ĐẶT HÀNG",
    processing: "Đang xử lý...",
    continueShopping: "Tiếp tục mua sắm",
    checkoutEmptyTitle: "Giỏ hàng của bạn đang trống!",
    checkoutEmptyDesc: "Vui lòng chọn sản phẩm trước khi tiến hành thanh toán.",
    backToShop: "Quay lại Cửa Hàng",
    subtotal: "Tạm tính",
    viewNow: "Xem Ngay"
  },
  EN: {
    home: "Home",
    shop: "Shop",
    about: "About Us",
    contact: "Contact",
    search: "Search...",
    categories: "Categories",
    all: "All",
    cart: "Cart",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    total: "Total",
    checkout: "Checkout",
    emptyCart: "Your cart is empty",
    price: "Price",
    color: "Color",
    details: "Details",
    options: "Order Options",
    shaftOptions: "Select Shaft",
    engraving: "Custom Engraving",
    engravingPlaceholder: "Enter name to engrave...",
    upgrades: "Butt Upgrades",
    otherReqs: "Other Requests",
    showing: "Showing",
    products: "products",
    filter: "Filters",
    clear: "Clear",
    noProducts: "No products found.",
    contactAdvice: "Contact for Advice",
    viewAll: "View All",
    featured: "Featured",
    noProductsHome: "No products available!",
    goToAdmin: "Go to Admin",
    checkoutDetails: "Shipping Information",
    fullName: "Full Name *",
    phone: "Phone Number *",
    province: "Province/City *",
    district: "District *",
    ward: "Ward *",
    address: "Street Address *",
    orderNotes: "Order Notes",
    paymentMethod: "Payment Method",
    cod: "Cash on Delivery (COD)",
    codDesc: "Pay when you receive the goods directly to the delivery person.",
    yourOrder: "Your Order",
    shippingFee: "Shipping Fee",
    freeTemp: "Free (Temporary)",
    confirmOrder: "CONFIRM ORDER",
    processing: "Processing...",
    continueShopping: "Continue Shopping",
    checkoutEmptyTitle: "Your cart is currently empty!",
    checkoutEmptyDesc: "Please select products before proceeding to checkout.",
    backToShop: "Back to Shop",
    subtotal: "Subtotal",
    viewNow: "View Now"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.VI) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('VI');

  useEffect(() => {
    // Xóa language cũ trong localStorage nếu có để tránh lỗi
    localStorage.removeItem('language');
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState('VI'); // Luôn ép về VI
  };

  const t = (key: keyof typeof translations.VI) => {
    return translations[language][key] || translations['VI'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
