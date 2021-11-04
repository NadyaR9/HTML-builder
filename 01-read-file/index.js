const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt')
const dataFromFile = fs.createReadStream(pathToFile, 'utf-8');
let data = '';
dataFromFile.on('data', chunk => data += chunk);
dataFromFile.on('end', () => {
    console.log(data);
    dataFromFile.close()
});
dataFromFile.on('error', error => console.log('Error:', error.message))