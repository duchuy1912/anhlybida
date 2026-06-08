-- Chạy lệnh này trong mục SQL Editor của Supabase

CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  notes text,
  total_amount bigint NOT NULL,
  status text DEFAULT 'pending',
  items jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cho phép mọi người có thể insert data (Vì guest checkout không có account)
-- Tuỳ chỉnh RLS nếu cần bảo mật hơn
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon read" ON orders
  FOR SELECT USING (true);
