import { supabase } from "@/lib/supabaseClient";
import HomeContent from "./HomeContent";

export const dynamic = 'force-dynamic';

// Định nghĩa server component để tự động fetch data khi load trang
export default async function Home() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name')
  ]);

  const allProducts = products || [];
  const allCategories = categories || [];

  return <HomeContent allProducts={allProducts} categories={allCategories} />;
}
