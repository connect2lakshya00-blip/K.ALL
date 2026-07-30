const fs = require('fs');
const src = 'C:\\Users\\adr\\.gemini\\antigravity\\brain\\4a6ec73d-6ea4-44ef-8558-c8f54540b01a\\career_coach_banner_1773570741681.png';
const dest = 'C:\\Users\\adr\\Desktop\\AIbot\\Senpai\\public\\career_new.png';
try {
  fs.copyFileSync(src, dest);
  console.log('SUCCESS: Image copied to', dest);
} catch(e) {
  console.error('ERROR:', e.message);
}
