const fs = require('fs').promises;
const path = require('path');

async function buildPage() {
  try {
    const distDir = path.join(__dirname, 'project-dist');
  
    // Remove existing project-dist directory if it exists
    await removeDirectory(distDir);
  
    // Create project-dist directory
    await fs.mkdir(distDir);
    console.log('project-dist directory created successfully.');
  
    // Read the contents of the template.html file
    const templateHtml = await fs.readFile(
      path.join(__dirname, 'template.html'),
      'utf-8'
    );

    // Replace template tags with component content
    const regex = /{{(.+?)}}/g;
    let match;
    let indexHtml = templateHtml;
    while ((match = regex.exec(templateHtml))) {
      const componentPath = path.join(
        __dirname,
        'components',
        `${match[1]}.html`
      );
      const componentHtml = await fs.readFile(componentPath, 'utf-8');
      indexHtml = indexHtml.replace(match[0], componentHtml);
    }

    // Write index.html file
    const indexHtmlPath = path.join(__dirname, 'project-dist', 'index.html');
    await fs.writeFile(indexHtmlPath, indexHtml);
    console.log('index.html created successfully.');

    // Combine CSS files
    const cssDir = path.join(__dirname, 'styles');
    const cssFiles = await fs.readdir(cssDir);
    let cssContent = '';
    for (const cssFile of cssFiles) {
      if (path.extname(cssFile) !== '.css') continue;
      const cssPath = path.join(cssDir, cssFile);
      const css = await fs.readFile(cssPath, 'utf-8');
      cssContent += css;
    }

    // Write style.css file
    const styleCssPath = path.join(__dirname, 'project-dist', 'style.css');
    await fs.writeFile(styleCssPath, cssContent);
    console.log('style.css created successfully.');

    // Copy assets directory
    const assetsDir = path.join(__dirname, 'assets');
    const assetsDistDir = path.join(__dirname, 'project-dist');
    await fs.mkdir(assetsDistDir, { recursive: true });
    await copyDir(assetsDir, path.join(assetsDistDir, 'assets'));
    console.log('Page built succesfully');
  } catch (err) {
    console.error('Error building:', err);
  }
}
async function copyDir(src, dest) {
  const files = await fs.readdir(src, { withFileTypes: true });

  await fs.mkdir(dest);

  for (let file of files) {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);
    if (file.isDirectory()) {
      await copyDir(srcPath, destPath);
    }
    else {
      if (path.extname(file.name) === '.html') {
        throw new Error('You cant copy html file!');
      }
      await fs.copyFile(srcPath, destPath);
    }
  }
}
async function removeDirectory(dirPath) {
  try {
    const dirStats = await fs.stat(dirPath);
  
    if (dirStats.isDirectory()) {
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileStats = await fs.stat(filePath);
  
        if (fileStats.isDirectory()) {
          await removeDirectory(filePath);
        } else {
          await fs.unlink(filePath);
        }
      }
      await fs.rmdir(dirPath);
    }
  } catch (error) {
    // Ignore the error if the directory doesn't exist
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}
buildPage();
