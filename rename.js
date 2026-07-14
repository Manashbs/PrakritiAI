const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(path.join(__dirname, 'frontend/src'), function (filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = content.replace(/VedicEra/g, 'PrakritiAI')
            .replace(/Vedic Era/g, 'PrakritiAI');
        if (content !== updated) {
            fs.writeFileSync(filePath, updated, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});

walkDir(path.join(__dirname, 'backend/src'), function (filePath) {
    if (filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = content.replace(/VedicEra/g, 'PrakritiAI')
            .replace(/Vedic Era/g, 'PrakritiAI');
        if (content !== updated) {
            fs.writeFileSync(filePath, updated, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
