const fsPromises = require('fs/promises');
const fs = require('fs')
const path = require('path');
(async function () {
    try {
        console.log(path.join(__dirname, 'secret-folder'))
        const files = await fsPromises.readdir(path.join(__dirname, 'secret-folder'), {
            encoding: 'utf-8',
            withFileTypes: true
        });
        for (const file of files) {
            let extname = path.extname(file.name)
            let filename = path.basename(file.name, extname)
            extname = extname.slice(1)
            fs.stat(path.join(__dirname, 'secret-folder', file.name), (error, stats) => {
                if (error) {
                    console.log(error);
                } else {
                    if (stats.isDirectory()) {
                        console.log(`${file.name} is not a file`)
                    } else {
                        console.log(`${filename} - ${extname} - ${(stats.size/1024).toFixed(2)}kb`)
                    }

                }
            })
        };
    } catch (err) {
        console.error(err);
    }
})()