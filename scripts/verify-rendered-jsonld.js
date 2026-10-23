const fs = require('fs');
const path = require('path');

function checkFile(slug) {
  const file = path.join(process.cwd(), '.next', 'server', 'app', 'store', `${slug}.html`);
  if (!fs.existsSync(file)) {
    console.log(`[FILE MISSING] ${file}`);
    return;
  }
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [];
  const regex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      scripts.push(JSON.parse(match[1]));
    } catch {
      scripts.push(match[1]);
    }
  }

  console.log(`\n--- Route: /store/${slug} ---`);
  console.log(`Total JSON-LD scripts found: ${scripts.length}`);
  scripts.forEach((s, idx) => {
    console.log(`Script #${idx + 1}: @type = ${s['@type'] || (s['@graph'] ? 'Graph' : 'Unknown')}`);
    if (s['@type'] === 'Product') {
      console.log('WARNING: Found Product @type!');
    }
    if (s.offers) {
      console.log('WARNING: Found offers object!');
    }
  });
}

checkFile('yojna-setu');
checkFile('spring-boot-starter');
checkFile('editorial-portfolio');
