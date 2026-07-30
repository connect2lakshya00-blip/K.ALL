const fs = require('fs');
const path = require('path');

const src = 'C:/Users/adr/.gemini/antigravity/brain/4a6ec73d-6ea4-44ef-8558-c8f54540b01a/career_coach_banner_1773570741681.png';
const dest = path.join(__dirname, 'public', 'career_new.png');

console.log('Reading from:', src);
console.log('Writing to:', dest);

try {
  const buf = fs.readFileSync(src);
  fs.writeFileSync(dest, buf);
  console.log('Done! Bytes written:', buf.length);
} catch(e) {
  console.error('Error:', e.message);
}
