const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
let url = '', key = '';
env.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});
const supabase = createClient(url, key);

async function checkStorage() {
  const { data: files, error } = await supabase.storage.from('product-images').list();
  if (error) {
    console.error('Error fetching files:', error);
    return;
  }
  
  if (!files || files.length === 0) {
    console.log('No files found in product-images bucket.');
    return;
  }
  
  let totalSize = 0;
  const largeFiles = [];
  
  files.forEach(file => {
    if (file.metadata && file.metadata.size) {
      totalSize += file.metadata.size;
      if (file.metadata.size > 1024 * 1024) {
        largeFiles.push({ name: file.name, size: (file.metadata.size / 1024 / 1024).toFixed(2) + ' MB' });
      }
    }
  });
  
  console.log('Total files:', files.length);
  console.log('Total size:', (totalSize / 1024 / 1024).toFixed(2) + ' MB');
  console.log('Files larger than 1MB:', largeFiles.length);
  console.log(largeFiles);
}

checkStorage();
