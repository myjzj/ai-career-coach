@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo 未找到 Node.js。请先安装 Node.js 18+：https://nodejs.org/
  echo 如果不想安装，也可以直接双击 index.html 打开（数据仍保存在浏览器）。
  echo.
  pause
  exit /b 1
)
node server.mjs
pause
