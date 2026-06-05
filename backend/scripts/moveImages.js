const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/JEEVAN/.gemini/antigravity/brain/aa64a668-5862-470b-ac79-71ad6d1d4341/';
const destDir = 'd:/4th sem/pro/frontend/public/images/cars/';

const files = [
    { src: 'toyota_camry_1765603655631.png', dest: 'toyota_camry.png' },
    { src: 'hyundai_creta_1765603672155.png', dest: 'hyundai_creta.png' },
    { src: 'honda_city_1765603703946.png', dest: 'honda_city.png' },
    { src: 'tata_nexon_1765603723640.png', dest: 'tata_nexon.png' },
    { src: 'maruti_swift_1765603740893.png', dest: 'maruti_swift.png' }
];

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

files.forEach(file => {
    const srcPath = path.join(srcDir, file.src);
    const destPath = path.join(destDir, file.dest);

    try {
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${file.src} to ${file.dest}`);
        } else {
            console.error(`Source file not found: ${srcPath}`);
        }
    } catch (err) {
        console.error(`Error copying ${file.src}:`, err.message);
    }
});
