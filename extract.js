const fs = require('fs');
const path = require('path');
try {
    const rawContent = fs.readFileSync('liquid_ether_registry_utf8.json', 'utf8');
    const cleanContent = rawContent.replace(/^\uFEFF/, '').trim();
    const data = JSON.parse(cleanContent);
    data.files.forEach(f => {
        const filePath = f.path;
        const dir = path.dirname(filePath);
        if (dir !== '.' && !fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, f.content);
        console.log(`Extracted ${filePath}`);
    });
} catch (err) {
    console.error('Error during extraction:', err);
    process.exit(1);
}
