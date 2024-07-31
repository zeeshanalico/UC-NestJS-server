import fs from 'fs';

// create directory in the given path
export const createDirectorySync = (directory: string) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {
            recursive: true
        });
    }
}

//This method creates a new file
export const writeFileSync = (filename: string, text: string) => {
    fs.writeFileSync(filename, text, { flag: 'a+' });
}
