-- Sửa lỗi: Cho phép cập nhật và xóa đơn hàng từ Admin
-- Chạy đoạn SQL này trong Supabase SQL Editor

CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete orders" ON public.orders FOR DELETE USING (true);
