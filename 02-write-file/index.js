const {
    stdin,
    stdout,
    exit
} = process;
const fs = require('fs');
const path = require('path');

process.on('exit', () => {
    stdout.write('Good luck\n');
    writableStream.close()

});
process.on('SIGINT', function () {
    exit();
});
const filePath = path.join(__dirname, 'notes.txt');

const writableStream = fs.createWriteStream(filePath, 'utf-8');

stdout.write('Lets write something!\n');
stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        exit()
    } else {
        writableStream.write(data.toString())
    }
})

writableStream.on('error', error => console.log('Error', error.message))