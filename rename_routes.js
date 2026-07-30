const fs = require('fs');
const path = require('path');

const base = path.join('app', '(main)');
const moves = [
    ['resume', 'resume-builder'],
    ['ai-cover-letter', 'cover-letter'],
    ['interview', 'mock-interview'],
    ['courses', 'course-generator'],
    ['roadmap', 'career-roadmap']
];

moves.forEach(([oldName, newName]) => {
    const oldPath = path.join(base, oldName);
    const newPath = path.join(base, newName);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${oldPath} to ${newPath}`);
    } else {
        console.log(`Path ${oldPath} does not exist`);
    }
});
