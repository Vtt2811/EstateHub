@echo off
title Stop EstateHub Services
echo ====================================================
echo 🛑 Stopping All EstateHub Services...
echo ====================================================

echo Closing Node.js processes (API, Socket, Client)...
taskkill /F /IM node.exe /T 2>nul

echo Closing MongoDB replica set...
taskkill /F /IM mongod.exe /T 2>nul

echo.
echo ✅ All EstateHub services have been stopped successfully!
pause
