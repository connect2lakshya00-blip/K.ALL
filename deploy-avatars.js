const fs = require('fs');
const path = require('path');

const sourceDir = `C:\\Users\\adr\\.gemini\\antigravity\\brain\\4a6ec73d-6ea4-44ef-8558-c8f54540b01a`;
const destDir = `c:\\Users\\adr\\Desktop\\AIbot\\Senpai\\public\\avatars`;

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = [
    { src: "professional_avatar_1_1773638294235.png", dest: "avatar1.png" },
    { src: "professional_avatar_2_1773638310292.png", dest: "avatar2.png" },
    { src: "professional_avatar_3_1773638324074.png", dest: "avatar3.png" },
];

files.forEach(file => {
    const srcPath = path.join(sourceDir, file.src);
    const destPath = path.join(destDir, file.dest);
    try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file.src} to ${file.dest}`);
    } catch (err) {
        console.error(`Failed to copy ${file.src}: ${err.message}`);
    }
});
