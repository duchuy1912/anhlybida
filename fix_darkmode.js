const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.module.css')) results.push(file);
    }
  });
  return results;
}

const cssFiles = walk('d:/FILEHOCTAP/Projects/bidaweb/src');

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('@media (prefers-color-scheme: dark)')) {
    // Rất đơn giản: Chúng ta chỉ cần thay thế @media ... { thành [data-theme='dark'] { không hoạt động
    // Vì bên trong @media có các class selector.
    // Ví dụ:
    // @media (prefers-color-scheme: dark) {
    //   .hero { background: #000; }
    // }
    // Cần thành:
    // :global([data-theme='dark']) .hero { background: #000; }
    
    // Thuật toán thô sơ: Tìm block @media, sau đó với mỗi selector bên trong, thêm :global([data-theme='dark']) phía trước
    const mediaRegex = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{([\s\S]*?)\n\}/g;
    
    let newContent = content.replace(mediaRegex, (match, innerCss) => {
      // innerCss chứa các rule: `.class { ... } \n .class2 { ... }`
      // chia theo '}'
      const rules = innerCss.split('}').map(r => r.trim()).filter(r => r);
      let newRules = rules.map(rule => {
        // rule có dạng: `.class { ...`
        // Thêm :global([data-theme='dark']) vào trước
        let parts = rule.split('{');
        if (parts.length === 2) {
          let selectors = parts[0].split(',').map(s => `:global([data-theme='dark']) ${s.trim()}`).join(', ');
          return `${selectors} { ${parts[1]}`;
        }
        return rule;
      });
      return newRules.join('}\n') + '}\n';
    });
    
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed:', file);
  }
});
