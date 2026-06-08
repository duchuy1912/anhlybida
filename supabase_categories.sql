-- Script tạo bảng categories
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật RLS và cấp quyền public
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép tất cả đọc categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Cho phép tất cả thêm categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Cho phép tất cả sửa categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Cho phép tất cả xóa categories" ON public.categories FOR DELETE USING (true);

-- Chèn dữ liệu mặc định ban đầu
INSERT INTO public.categories (name, slug) VALUES 
('Cơ Libre', 'co-libre'),
('Cơ 3 Băng', 'co-3-bang'),
('Cơ Pool', 'co-pool'),
('Phụ Kiện', 'phu-kien');
