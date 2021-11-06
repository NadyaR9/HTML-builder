const fsPromises = require('fs/promises');
const path = require('path');
const process = require('process')
process.on('exit', () => console.log(`Exit`))
const srcStyles = path.join(__dirname, 'styles');
const srcAssets = path.join(__dirname, 'assets');
const dist = path.join(__dirname, 'project-dist');
mergeStyles(srcStyles, dist);
copyFolder(srcAssets, path.join(dist, 'assets'));
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
                    //console.log(file.name);
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
        fsPromises.writeFile(path.join(dist, 'style.css'), styles, {
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

async function copyFolder(src, dist) {
    let exist = false;
    let isDirectory = false;
    let st;
    try {
        st = await fsPromises.stat(src);
        exist = true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`Directory not exist`)
        }
        process.exit()
    }
    isDirectory = st.isDirectory()
    if (exist && isDirectory) {
        try {
            await fsPromises.rmdir(dist, {
                recursive: true
            })
        } catch (error) {
            console.log(`Something went wrong with ${error.code} --- ${error}`)
        }
        await fsPromises.mkdir(dist, {
            recursive: true
        })

        for (const file of (await fsPromises.readdir(src)).values()) {
            await copyFolder(path.join(src, file), path.join(dist, file))
        }
    } else {
        try {
            await fsPromises.copyFile(src, dist)
        } catch (error) {
            console.log(`Something went wrong with ${error.code} --- ${error}`)
        }
    }
}

async function createPage(src, dist) {
    let fileContent = '';
    try {
        const data = await fsPromises.readFile(path.join(src, 'template.html'));
        fileContent += data.toString() + '\n';
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
    const files = await fsPromises.readdir(path.join(src, 'components'), {
        encoding: 'utf-8',
        withFileTypes: true
    });
    let filesKeyContent = {};
    let keys = []
    for (const file of files) {
        try {
            st = await fsPromises.stat(path.join(src, 'components', file.name));
            let fileExtend = path.extname(file.name);
            if (st.isFile() && fileExtend === '.html') {

                try {
                    const data = await fsPromises.readFile(path.join(src, 'components', file.name));
                    let fileName = path.basename(file.name, path.extname(file.name))
                    filesKeyContent[`${fileName}`] = data.toString() + '\n';
                    keys.push(fileName);
                } catch (error) {
                    console.error(`Got an error trying to read the file: ${error.message}`);
                }
            }
        } catch (error) {
            console.log(`Something went wrong with ${error.code} --- ${error}`)
        }
    }
    console.log(filesKeyContent)
    console.log(keys)
    for (let key of keys) {
        fileContent = fileContent.replace(`{{${key}}}`, filesKeyContent[key])
    }
    fsPromises.writeFile(path.join(dist, 'index.html'), fileContent, {
            encoding: "utf8",
            flag: "w",
            mode: 0o666
        })
        .catch((error) => {
            console.log(error);
        });
}

createPage(path.join(__dirname), dist);