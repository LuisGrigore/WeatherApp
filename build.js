// build.js
import { build } from 'esbuild';
import { minify as cssoMinify } from 'csso';
import { minify as htmlMinify } from 'html-minifier-terser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

async function main() {
  // 1️⃣ Limpiar /dist
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  // 2️⃣ JS: bundle + minificar
  await build({
    entryPoints: [path.join(srcDir, 'js', 'main.js')],
    bundle: true,
    minify: true,
    outfile: path.join(distDir, 'app.js')
  });

  // 3️⃣ CSS: minificar y mantener separado
  const cssPath = path.join(srcDir, 'css', 'styles.css');
  const cssDist = path.join(distDir, 'styles.css');
  const cssCode = await fs.readFile(cssPath, 'utf8');
  const minifiedCss = cssoMinify(cssCode).css;
  await fs.writeFile(cssDist, minifiedCss);

  // 4️⃣ HTML: minificar y actualizar rutas
  let html = await fs.readFile(path.join(srcDir, 'index.html'), 'utf8');
  html = html.replace('./js/main.js', './app.js');         // JS bundle
  html = html.replace('./css/styles.css', './styles.css'); // CSS minificado
  const minifiedHtml = await htmlMinify(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true,
    minifyCSS: true
  });
  await fs.writeFile(path.join(distDir, 'index.html'), minifiedHtml);


  console.log('✔ Build completo en /dist');
}

main();
