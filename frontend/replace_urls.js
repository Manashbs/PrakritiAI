const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
let changed = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace "http://localhost:3001/..." with `${process.env.NEXT_PUBLIC_API_URL}/...`
    const regexDouble = /"http:\/\/localhost:3001([^"]*)"/g;
    let newContent = content.replace(regexDouble, '`${process.env.NEXT_PUBLIC_API_URL}$1`');
    
    // Replace `http://localhost:3001/...` with `${process.env.NEXT_PUBLIC_API_URL}/...` 
    // already in backticks, just replace the URL part
    const regexBacktick = /http:\/\/localhost:3001/g;
    newContent = newContent.replace(regexBacktick, '${process.env.NEXT_PUBLIC_API_URL}');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        changed++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`Done. Updated ${changed} files.`);
