const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTable() {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Lỗi Select Banners:", error);
  } else {
    console.log("Banners Data:", data);
  }
}

testTable();
