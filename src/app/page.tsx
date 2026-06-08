import { supabase } from "@/lib/supabaseClient";
import HomeContent from "./HomeContent";

export const dynamic = 'force-dynamic';

// Định nghĩa server component để tự động fetch data khi load trang
export default async function Home() {
  // Lấy toàn bộ sản phẩm từ DB
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const allProducts = products || [];

  return <HomeContent allProducts={allProducts} />;
}
