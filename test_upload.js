const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  fs.writeFileSync('test.txt', 'Hello world');
  const buffer = fs.readFileSync('test.txt');

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload('test.txt', buffer, { upsert: true });

  if (error) {
    console.error("Lỗi Upload:", error);
  } else {
    console.log("Upload thành công!", data);
  }
}

testUpload();
