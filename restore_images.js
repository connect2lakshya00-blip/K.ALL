const fs = require('fs');
const path = require('path');

const images = [
  { src: 'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_mentor_png_1773771813716.png', dest: 'ai_mentor.png' },
  { src: 'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_resume_png_1773771832564.png', dest: 'ai_resume.png' },
  { src: 'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_pathfinder_png_1773771852124.png', dest: 'ai_pathfinder.png' },
  { src: 'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_interview_png_1773771877276.png', dest: 'ai_interview.png' },
  { src: 'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce/ai_market_png_1773771897454.png', dest: 'ai_market.png' }
];

const publicDir = 'c:/Users/adr/Desktop/AIbot/Senpai/public';

images.forEach(img => {
  try {
    const data = fs.readFileSync(img.src);
    fs.writeFileSync(path.join(publicDir, img.dest), data);
    console.log(`Successfully wrote ${img.dest}`);
  } catch (e) {
    console.error(`Failed to write ${img.dest}: ${e.message}`);
  }
});
