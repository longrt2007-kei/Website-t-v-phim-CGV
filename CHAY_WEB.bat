@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo      CGV WEB - KHOI DONG DU AN
echo ========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [LOI] May chua cai Node.js.
  echo Hay cai Node.js LTS 18 tro len, sau do chay lai file nay.
  pause
  exit /b 1
)

if not exist node_modules\json-server-auth (
  echo [1/2] Dang cai/cap nhat thu vien, bao gom json-server-auth...
  call npm install
  if errorlevel 1 (
    echo.
    echo [LOI] npm install that bai. Kiem tra ket noi Internet roi thu lai.
    pause
    exit /b 1
  )
)

echo [2/2] Dang mo web...
echo Trang web: http://127.0.0.1:5173/trangchu.html
echo API Auth:  http://127.0.0.1:3001
echo.
call npm run dev
pause
