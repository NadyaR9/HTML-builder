const fsPromises = require('fs/promises');
const fs = require('fs')
const path = require('path');
const process = require('process')
const src = path.join(__dirname, 'files');
const dist = path.join(__dirname, 'files-copy')

process.on('exit', () => console.log(`Exit`))
// async function createFolder() {
//     await fsPromises.mkdir(dist, {
//         recursive: true
//     })
//     console.log(`Folder ${dist} was create`)

// }
// createFolder()

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
copyFolder(src, dist);

