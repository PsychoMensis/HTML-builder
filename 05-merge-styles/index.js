const fs = require('fs');
const path = require('path');

const srcDir = '05-merge-styles/styles';
const destDir = '05-merge-styles/project-dist';
const destFile = 'bundle.css';

// Получаем список файлов из папки со стилями
fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');

  // Считываем содержимое файлов и объединяем в одну строку
  let cssContent = '';
  let filesProcessed = 0;

  cssFiles.forEach(file => {
    const filePath = path.join(srcDir, file.name);
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) throw err;
      cssContent += content + '\n';
      filesProcessed++;

      // Записываем общий CSS в файл, если все файлы были обработаны
      if (filesProcessed === cssFiles.length) {
        // Создаем папку dist, если она еще не существует
        fs.mkdir(destDir, { recursive: true }, (err) => {
          if (err) throw err;

          fs.writeFile(path.join(destDir, destFile), cssContent, (err) => {
            if (err) throw err;
            console.log(`File '${destFile}' was created in '${destDir}' directory.`);
          });
        });
      }
    });
  });
});
