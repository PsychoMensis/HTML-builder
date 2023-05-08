const fs = require("fs").promises;
const path = require("path");

async function buildPage() {
  try {
    // Create project-dist directory
    await fs.mkdir(path.join(__dirname, "project-dist"));
    console.log("project-dist directory created successfully.");

    // Read the contents of the template.html file
    const templateHtml = await fs.readFile(
      path.join(__dirname, "template.html"),
      "utf-8"
    );

    // Replace template tags with component content
    const regex = /{{(.+?)}}/g;
    let match;
    let indexHtml = templateHtml;
    while ((match = regex.exec(templateHtml))) {
      const componentPath = path.join(
        __dirname,
        "components",
        `${match[1]}.html`
      );
      const componentHtml = await fs.readFile(componentPath, "utf-8");
      indexHtml = indexHtml.replace(match[0], componentHtml);
    }

    // Write index.html file
    const indexHtmlPath = path.join(__dirname, "project-dist", "index.html");
    await fs.writeFile(indexHtmlPath, indexHtml);
    console.log("index.html created successfully.");

    // Combine CSS files
    const cssDir = path.join(__dirname, "styles");
    const cssFiles = await fs.readdir(cssDir);
    let cssContent = "";
    for (const cssFile of cssFiles) {
      if (path.extname(cssFile) !== ".css") continue;
      const cssPath = path.join(cssDir, cssFile);
      const css = await fs.readFile(cssPath, "utf-8");
      cssContent += css;
    }

    // Write style.css file
    const styleCssPath = path.join(__dirname, "project-dist", "style.css");
    await fs.writeFile(styleCssPath, cssContent);
    console.log("style.css created successfully.");

    // Copy assets directory
    const assetsDir = path.join(__dirname, "assets");
    const assetsDistDir = path.join(__dirname, "project-dist", "assets");
    await fs.mkdir(assetsDistDir, { recursive: true });
    const assets = await fs.readdir(assetsDir);
    for (const asset of assets) {
      const assetPath = path.join(assetsDir, asset);
      const assetDistPath = path.join(assetsDistDir, asset);
      await fs.copyFile(assetPath, assetDistPath)
    }
    console.log("assets directory copied successfully.");
  } catch (err) {
    console.error(err);
  }
}

buildPage();
