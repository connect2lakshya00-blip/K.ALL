const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/adr/.gemini/antigravity/brain/b4a8ca8f-2935-4482-a950-ff116aabccce';
const destDir = 'c:/Users/adr/Desktop/AIbot/Senpai/public';

const files = [
    'ai_career_mentor_hero_1773770275517.png',
    'ai_resume_analyzer_hero_1773770369106.png',
    'ai_career_pathfinder_hero_1773770387954.png',
    'ai_mock_interview_hero_1773770406263.png',
    'ai_job_market_intelligence_hero_1773770426628.png'
];

files.forEach(file => {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    try {
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`Successfully copied ${file}`);
        } else {
            console.error(`Source file not found: ${src}`);
        }
    } catch (err) {
        console.error(`Error copying ${file}:`, err);
    }
});
