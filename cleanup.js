const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
async function cleanup() {
  try {
    const env = fs.readFileSync('.env.local', 'utf-8');
    let url = '', key = '';
    env.split('\n').forEach(line => {
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
    });
    const supabase = createClient(url, key);
    const { data: files, error: filesError } = await supabase.storage.from('product-images').list();
    if (filesError) throw filesError;
    const bucketFiles = files.filter(f => f.name !== '.emptyFolderPlaceholder' && f.id);
    console.log('Found ' + bucketFiles.length + ' files in bucket.');
    const { data: products, error: prodError } = await supabase.from('products').select('images');
    if (prodError) throw prodError;
    const usedImageUrls = new Set();
    products.forEach(p => {
      if (p.images && Array.isArray(p.images)) {
        p.images.forEach(imgUrl => usedImageUrls.add(imgUrl));
      }
    });
    console.log('Found ' + usedImageUrls.size + ' used images in database.');
    const orphanedFiles = [];
    bucketFiles.forEach(file => {
      const fileUrl = url + '/storage/v1/object/public/product-images/' + file.name;
      if (!usedImageUrls.has(fileUrl)) {
        orphanedFiles.push(file.name);
      }
    });
    console.log('Found ' + orphanedFiles.length + ' orphaned files.');
    if (orphanedFiles.length > 0) {
      console.log('Deleting orphaned files...');
      const { data, error } = await supabase.storage.from('product-images').remove(orphanedFiles);
      if (error) throw error;
      console.log('Successfully deleted:', data.map(d => d.name).join(', '));
    } else {
      console.log('No orphaned files to delete.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
cleanup();
