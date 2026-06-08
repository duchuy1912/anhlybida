const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOrderUpdate() {
  // 1. Lấy danh sách orders
  const { data: orders, error: fetchErr } = await supabase
    .from('orders')
    .select('id, status')
    .limit(1);

  if (fetchErr) {
    console.error("Lỗi đọc orders:", fetchErr);
    return;
  }

  if (!orders || orders.length === 0) {
    console.log("Không có đơn hàng nào để test.");
    return;
  }

  const testOrder = orders[0];
  console.log("Đơn hàng hiện tại:", testOrder);

  // 2. Thử update status
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'processing' })
    .eq('id', testOrder.id)
    .select();

  if (error) {
    console.error("❌ LỖI UPDATE:", error);
    console.log("\n=> NGUYÊN NHÂN: Bảng 'orders' chưa có RLS policy cho UPDATE.");
    console.log("=> Bạn cần chạy SQL sau trên Supabase:");
    console.log(`
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete orders" ON public.orders FOR DELETE USING (true);
    `);
  } else {
    console.log("✅ Update thành công!", data);
  }
}

testOrderUpdate();
