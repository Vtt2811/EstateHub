@echo off
title Launch EstateHub
echo ====================================================
echo 🚀 Launching EstateHub Services...
echo ====================================================

:: 1. Start MongoDB Replica Set on port 27018
start "EstateHub MongoDB (Port 27018)" "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "v:\Vishesh\MP\EstateHub-main\.mongo_data" --port 27018 --replSet rs0 --bind_ip 127.0.0.1

:: 2. Start API Backend on port 8800
start "EstateHub API (Port 8800)" cmd /k "cd /d v:\Vishesh\MP\EstateHub-main\api && npm run dev"

:: 3. Start Socket Server on port 4000
start "EstateHub Socket (Port 4000)" cmd /k "cd /d v:\Vishesh\MP\EstateHub-main\socket && npm start"

:: 4. Start React Frontend Client on port 5173
start "EstateHub Client (Port 5173)" cmd /k "cd /d v:\Vishesh\MP\EstateHub-main\client && npm run dev"

echo.
echo ✅ All 4 EstateHub services are opening in separate windows!
echo Once loaded, open your browser at: http://localhost:5173
pause
