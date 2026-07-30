const fs = require('fs');

const images = [
  'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_mentor_png_1773771813716.png',
  'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_resume_png_1773771832564.png',
  'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_pathfinder_png_1773771852124.png',
  'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_interview_png_1773771877276.png',
  'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_market_png_1773771897454.png'
];

images.forEach((path, i) => {
  try {
    const b64 = fs.readFileSync(path, { encoding: 'base64' });
    console.log(`IMAGE_${i}_START`);
    console.log(b64);
    console.log(`IMAGE_${i}_END`);
  } catch (e) {
    console.error(`Error reading ${path}: ${e.message}`);
  }
});
