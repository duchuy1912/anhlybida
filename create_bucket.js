const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  const { data, error } = await supabase.storage.createBucket('product-images', { public: true });
  if (error) {
    console.error("Lỗi:", error);
  } else {
    console.log("Thành công:", data);
  }
}

setup();
