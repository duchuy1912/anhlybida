import { supabase } from "@/lib/supabaseClient";
import HomeContent from "./HomeContent";

export const revalidate = 60;

// ï¿½?nh ngh?a server component ï¿½? t? ï¿½?ng fetch data khi load trang
export default async function Home() {
  const [{ data: products }, { data: categories }, { data: banners }] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
    supabase.from("banners").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false })
  ]);

  const allProducts = products || [];
  const allCategories = categories || [];
  const allBanners = banners || [];

  return <HomeContent allProducts={allProducts} categories={allCategories} banners={allBanners} />;
}

