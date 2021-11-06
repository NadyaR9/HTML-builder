const fsPromises = require('fs/promises');
const path = require('path');
const process = require('process')
process.on('exit', () => console.log(`Exit`))
const src = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist');
async function mergeStyles(src, dist) {
    try {
        const files = await fsPromises.readdir(src, {
            encoding: 'utf-8',
            withFileTypes: true
        });
        let styles = ''
        for (const file of files) {

            try {
                st = await fsPromises.stat(path.join(src, file.name));
                let fileExtend = path.extname(file.name);
                if (st.isFile() && fileExtend === '.css') {
                    console.log(file.name);
                    try {
                        const data = await fsPromises.readFile(path.join(src, file.name));
                        styles += data.toString() + '\n';
                    } catch (error) {
                        console.error(`Got an error trying to read the file: ${error.message}`);
                    }
                }
            } catch (error) {
                console.log(`Something went wrong with ${error.code} --- ${error}`)
            }
        }
        fsPromises.writeFile(path.join(dist, 'bundle.css'), styles, {
                encoding: "utf8",
                flag: "w",
                mode: 0o666
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(`Something went wrong with ${error.code} --- ${error}`)
    }
}

mergeStyles(src, dist)