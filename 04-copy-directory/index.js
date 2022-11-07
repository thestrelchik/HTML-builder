const fs = require('fs/promises');
const path = require('path')
const { resolve } = require('path');
const pathToFile = resolve(__dirname, 'files');
const destination = resolve(__dirname, 'files-copy');

async function copy(path) {
  try {
    await fs.mkdir(destination, {recursive: true});
    const filesDest = await fs.readdir(destination);
    filesDest.forEach(files => fs.unlink(resolve(destination, files)));

    const filesSrc = await fs.readdir(pathToFile);
    filesSrc.forEach(files => fs.copyFile(resolve(path, files), resolve(destination, files)));
  } catch (err) {
    console.log(err.massage)
  }
};
copy(pathToFile)