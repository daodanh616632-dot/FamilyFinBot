@echo off
title SMM Tool - Cloudflare Tunnel
cd /d "C:\Users\Hoang_Trang\Desktop"
cls
echo ============================================
echo    SMM TOOL - Facebook cam xuc
echo ============================================
echo.

REM Don port 5500
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5500" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
)

REM Start local server
start /B node server.js >nul 2>nul

echo  Bat dau tao tunnel...
echo.
echo ============================================
echo  MOI DIEN THOAI: Mo trinh duyet, nhap link
echo  ben duoi (4G hay WiFi gi cung duoc):
echo ============================================
echo.

npx --yes cloudflared tunnel --url http://localhost:5500 2>&1 | findstr "trycloudflare.com"

echo.
echo ============================================
echo  Loi? Thu chay lai file batch.
echo  Nhan Ctrl + C de dung.
echo ============================================
pause
