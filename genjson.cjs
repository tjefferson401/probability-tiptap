const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public'); // Adjust the path as needed

const getFileStructure = (dir) => {
    const result = [];
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            result.push({
                name: file,
                type: 'directory',
                children: getFileStructure(filePath)
            });
        } else {
            result.push({
                name: file,
                type: 'file'
            });
        }
    });
    return result;
};

const fileStructure = getFileStructure(directoryPath);

fs.writeFileSync(
    path.join(__dirname, 'public', 'fileStructure.json'),
    JSON.stringify(fileStructure, null, 2),
    'utf-8'
);
// console.log(fileStructure)

console.log('fileStructure.json has been generated.');
