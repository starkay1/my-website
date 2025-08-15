#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 需要临时移动的目录
const dirsToMove = [
  { src: path.join(__dirname, '../src/app/api'), backup: path.join(__dirname, '../temp-api-backup') },
  { src: path.join(__dirname, '../src/app/admin'), backup: path.join(__dirname, '../temp-admin-backup') },
  { src: path.join(__dirname, '../src/app/careers'), backup: path.join(__dirname, '../temp-careers-backup') }
  // 不移动 [locale] 目录，因为它包含主页内容
];

console.log('Building static version for GitHub Pages...');

try {
  // 临时移动目录
  dirsToMove.forEach(({ src, backup }) => {
    if (fs.existsSync(src)) {
      console.log(`Temporarily moving ${path.basename(src)} directory...`);
      if (fs.existsSync(backup)) {
        fs.rmSync(backup, { recursive: true, force: true });
      }
      fs.renameSync(src, backup);
    }
  });

  // 设置环境变量并构建
  process.env.GITHUB_PAGES = 'true';
  process.env.NODE_ENV = 'production';
  
  console.log('Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 创建根路径的 index.html 重定向文件
  const outDir = path.join(__dirname, '../out');
  const indexPath = path.join(outDir, 'index.html');
  
  if (fs.existsSync(outDir)) {
    console.log('Creating root index.html redirect...');
    const indexContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SpacePlus - 重定向中...</title>
    <meta http-equiv="refresh" content="0; url=/zh-CN/">
    <link rel="canonical" href="https://spaceplusworldwide.club/zh-CN/">
    <script>
        // 立即重定向到中文页面
        window.location.replace('/zh-CN/');
    </script>
</head>
<body>
    <p>正在重定向到 <a href="/zh-CN/">中文页面</a>...</p>
</body>
</html>`;
    
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('Root index.html created successfully!');
  }
  
  console.log('Static build completed successfully!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} finally {
  // 恢复目录
  dirsToMove.forEach(({ src, backup }) => {
    if (fs.existsSync(backup)) {
      console.log(`Restoring ${path.basename(src)} directory...`);
      if (fs.existsSync(src)) {
        fs.rmSync(src, { recursive: true, force: true });
      }
      fs.renameSync(backup, src);
    }
  });
}