# EstateHub One-Click PowerShell Startup Script
$projectDir = "v:\Vishesh\MP\EstateHub-main"

Write-Host "🚀 Starting EstateHub Services..." -ForegroundColor Green

# 1. Start MongoDB Replica Set on port 27018
Write-Host "1/4 Starting MongoDB Replica Set..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '== MongoDB Replica Set (port 27018) ==' -ForegroundColor Cyan; & 'C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe' --dbpath '$projectDir\.mongo_data' --port 27018 --replSet rs0 --bind_ip 127.0.0.1"

# 2. Start API Backend on port 8800
Write-Host "2/4 Starting API Backend (port 8800)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '== API Backend ==' -ForegroundColor Cyan; cd '$projectDir\api'; npm run dev"

# 3. Start Socket Server on port 4000
Write-Host "3/4 Starting Socket Server (port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '== Socket Server ==' -ForegroundColor Cyan; cd '$projectDir\socket'; npm start"

# 4. Start React Frontend Client on port 5173
Write-Host "4/4 Starting Frontend Client (port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '== Frontend Client ==' -ForegroundColor Cyan; cd '$projectDir\client'; npm run dev"

Write-Host "✅ All EstateHub services launched! Access your app at: http://localhost:5173" -ForegroundColor Green
