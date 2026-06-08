-- Script tạo bảng banners
CREATE TABLE public.banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    link TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật RLS và cấp quyền public
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép tất cả đọc banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Cho phép tất cả thêm banners" ON public.banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Cho phép tất cả sửa banners" ON public.banners FOR UPDATE USING (true);
CREATE POLICY "Cho phép tất cả xóa banners" ON public.banners FOR DELETE USING (true);

-- Chèn dữ liệu mẫu (Giống các banner cứng lúc trước)
INSERT INTO public.banners (image_url, title, subtitle, link, display_order) VALUES 
('/images/cue_1.png', 'Cơ Lỗ Cao Cấp', 'Giảm giá 20% cho dòng cơ lỗ mới nhất nhập khẩu từ Mỹ', '/shop?category=co-lo', 1),
('/images/balls_1.png', 'Anhly Bida', 'Khẳng định phong cách và đẳng cấp trên từng đường cơ', '/shop', 2),
('/images/chalk_1.png', 'Phụ Kiện Chính Hãng', 'Bao da, lơ, đầu cơ chuẩn quốc tế dành riêng cho dân chuyên', '/shop?category=phu-kien', 3);
