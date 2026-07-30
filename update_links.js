const fs = require('fs');
const path = require('path');

const replacements = [
    [/\"\/resume\"/g, '"/resume-builder"'],
    [/\"\/ai-cover-letter\"/g, '"/cover-letter"'],
    [/\"\/interview\"/g, '"/mock-interview"'],
    [/\"\/courses\"/g, '"/course-generator"'],
    [/\"\/roadmap\"/g, '"/career-roadmap"'],
    [/\'\/resume\'/g, "'/resume-builder'"],
    [/\'\/ai-cover-letter\'/g, "'/cover-letter'"],
    [/\'\/interview\'/g, "'/mock-interview'"],
    [/\'\/courses\'/g, "'/course-generator'"],
    [/\'\/roadmap\'/g, "'/career-roadmap'"]
];

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDirs = ['app', 'components', 'actions'];

targetDirs.forEach(targetDir => {
    const fullPath = path.resolve(targetDir);
    if (fs.existsSync(fullPath)) {
        walk(fullPath, (filePath) => {
            if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
                let content = fs.readFileSync(filePath, 'utf8');
                let changed = false;
                replacements.forEach(([regex, replacement]) => {
                    if (regex.test(content)) {
                        content = content.replace(regex, replacement);
                        changed = true;
                    }
                });
                if (changed) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`Updated routes in ${filePath}`);
                }
            }
        });
    }
});
