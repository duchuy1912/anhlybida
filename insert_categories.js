const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertCategories() {
  const defaultCategories = [
    { name: 'Cơ Libre', slug: 'co-libre' },
    { name: 'Cơ 3 Băng', slug: 'co-3-bang' },
    { name: 'Cơ Pool', slug: 'co-pool' },
    { name: 'Phụ Kiện', slug: 'phu-kien' }
  ];

  const { data, error } = await supabase
    .from('categories')
    .insert(defaultCategories);

  if (error) {
    console.error('Lỗi khi thêm:', error.message);
  } else {
    console.log('Đã thêm thành công 4 danh mục mặc định!');
  }
}

insertCategories();
