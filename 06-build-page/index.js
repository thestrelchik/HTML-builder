const path = require('path');
const fs = require('fs');
const { rm, mkdir, readdir, writeFile, readFile, copyFile } = require('fs/promises');
//Удаляет файлы и каталоги, Асинхронно создает каталог, читаем содержимое каталога, записываем данные в файл, читаем данные в файле, Асинхронно копирует src к dest

let data = '';

const projectDist = path.join(__dirname, 'project-dist');



async function addCss() { //копируем и собираем styles
  try {
    const filesInFolder = await readdir(path.join(__dirname,'styles'), {withFileTypes: true}); //получаем файлы в паке styles
    for (let i of filesInFolder) {
      if (path.extname(path.join(__dirname, 'styles', i.name)) === '.css') { //проверка на css
        const stream = fs.createReadStream(path.join(__dirname,'styles', i.name)); //для чтения в старом файле
        const output = fs.createWriteStream(path.join(projectDist, 'style.css')); // для записи в новом файле

        stream.on('data', chunk => data += chunk); //сливаем 2 потока
        stream.on('error', err => console.log(err.massage));
        stream.on('end', () => output.write(data)) // записываем в новый файл
      }
    }
  } catch (err) {
    console.log(err.massage)
  }
}


async function copy(assets, copyAssets) { //копируем папку assets с файлами
  try {
    const pathToFiles = await readdir(path.join(assets), {withFileTypes: true}); // путь к папке assets
    for (let i of pathToFiles) {
      if (i.isFile()) { // проверка на файл
        copyFile(path.join(assets,i.name), path.join(copyAssets,i.name)); //копируем и вставляем в новый путь
      } else {
        await mkdir(path.join(copyAssets,i.name), { recursive: true }); // создаем новую директорию с выбранным путем
        await copy(path.join(assets,i.name),path.join(copyAssets,i.name)); // копируем из старого в новый путь
      }
    }
  } catch (err) {
    console.log(err.massage)
  } 
}

async function addComponents() { // читаем, записывваем файлы из папке components
  try {
    let names = [];

    const files = await readdir(path.join(__dirname, 'components'), {withFileTypes: true}); // читаем путь папки
    for (let i of files) {
      names.push(path.parse(path.join(__dirname, 'components', i.name)).name); // отправляем название в массив
    }
    let index = await readFile(path.join(__dirname,'template.html'), 'utf-8'); // получаем данные в файле tempale.html
    for (let i of names) {
      let html = await readFile(path.join(__dirname, 'components', `${i}.html`), 'utf-8'); // читаес файл в папке components
      index = index.replace(`{{${i}}}`, html);  // ищем совпадение и меняем
    }
    await writeFile(path.join(projectDist, 'index.html'), index);

  } catch (err) {
    console.log(err.massage)
  } 
}

async function buildPage() {
  try {
    await mkdir(path.join(projectDist), { recursive: true }); // путь к папке progect-dist
    await mkdir(path.join(projectDist, 'assets'), { recursive: true }); //путь к progect-dist/assets
    const cssFile = path.join(projectDist, 'style.css') // путь к progect-dist/style.css
    await writeFile(cssFile, '');

    addCss();
    addComponents();
    let assets = path.join(__dirname, 'assets')
    let copyAssets = path.join(projectDist, 'assets')
    copy(assets, copyAssets);

  } catch (err) {
    console.log(err.massage)
  }
}
buildPage();