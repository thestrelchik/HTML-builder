// const { log } = require('console');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const  rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const pathToFile = path.join('02-write-file', 'text.txt')
const fileText = fs.createWriteStream(pathToFile)


function write() {

  rl.question('введите текст: ', text => {
    console.log(text);
    if (text.toLocaleLowerCase() === 'exit') {
      console.log('Пока, удачи');
      rl.close()
      return
    }
    
    fileText.write(text + '\n', err => {
      if (err) {
        console.log(err.message);
      } else {
        write()
      }
    })
    process.on('exit', () => {
      console.log('Пока, удачи');
      rl.close()
    });
  })
}
write()
