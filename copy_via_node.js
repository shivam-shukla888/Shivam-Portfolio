const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\thesh\\.gemini\\antigravity\\brain\\e0dce68b-a5c8-4fe3-a247-0962a64c60ea';
const destDir = 'c:\\Users\\thesh\\rajesh-portfolio\\public\\images';
const resumeDestDir = 'c:\\Users\\thesh\\rajesh-portfolio\\public';

const files = {
    'media__1773155120465.png': path.join(destDir, 'shivam.png'),
    'media__1773155120475.png': path.join(destDir, 'vmitra.png'),
    'media__1773155120528.png': path.join(destDir, 'sas_ai.png'),
    'media__1773155120519.png': path.join(resumeDestDir, 'shivam_shukla_resume.png'),
    'quickeats_dashboard_1773154489741.png': path.join(destDir, 'quickeats.png'),
    'spring_security_icon_1773154867445.png': path.join(destDir, 'springsecurity.png'),
    'postgresql_icon_1773154892511.png': path.join(destDir, 'postgresql.png'),
    'git_icon_1773154911189.png': path.join(destDir, 'git.png'),
    'github_icon_3d_1773154929064.png': path.join(destDir, 'github_3d.png'),
    'intellij_icon_1773154947668.png': path.join(destDir, 'intellij.png')
};

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

for (const [srcName, destPath] of Object.entries(files)) {
    const srcPath = path.join(sourceDir, srcName);
    try {
        if (fs.existsSync(srcPath)) {
            const data = fs.readFileSync(srcPath);
            fs.writeFileSync(destPath, data);
            console.log(`Copied ${srcName} to ${destPath}`);
        } else {
            console.error(`Source not found: ${srcPath}`);
        }
    } catch (err) {
        console.error(`Error copying ${srcName}: ${err.message}`);
    }
}
console.log('Final check:');
if (fs.existsSync(path.join(destDir, 'shivam.png'))) {
    console.log('shivam.png exists!');
} else {
    console.log('shivam.png STILL MISSING');
}
