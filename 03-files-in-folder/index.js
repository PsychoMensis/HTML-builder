const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error getting file stats: ${err}`);
        return;
      }

      if (!stats.isFile()) {
        return;
      }

      const fileSizeInBytes = stats.size;
      const fileSizeInKilobytes = fileSizeInBytes / 1024;

      console.log(`${path.parse(file).name} - ${path.parse(file).ext.substring(1)} - ${fileSizeInKilobytes.toFixed(3)}kb`);
    });
  });
});
