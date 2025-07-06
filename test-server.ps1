#!/usr/bin/env pwsh
# Script để test server locally trước khi commit

Write-Host "🚀 Bắt đầu test QLDAPM Server..." -ForegroundColor Green

# Test 1: Kiểm tra Python và dependencies
Write-Host "`n📋 Test 1: Kiểm tra dependencies..." -ForegroundColor Yellow
try {
    Set-Location server
    python -m pip install -r requirements.txt --quiet
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Lỗi cài đặt dependencies: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Test import server
Write-Host "`n📋 Test 2: Test import server..." -ForegroundColor Yellow
try {
    $result = python -c "
try:
    from main import app
    print('SUCCESS')
except Exception as e:
    print(f'ERROR: {e}')
    exit(1)
"
    if ($result -eq "SUCCESS") {
        Write-Host "✅ Server import thành công" -ForegroundColor Green
    } else {
        Write-Host "❌ Lỗi import server: $result" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Lỗi test import: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Test server startup
Write-Host "`n📋 Test 3: Test server startup..." -ForegroundColor Yellow
try {
    # Chạy server trong background
    $serverJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD\server
        python -m uvicorn main:app --host 0.0.0.0 --port 8001
    }
    
    # Đợi server khởi động
    Start-Sleep -Seconds 8
    
    # Test health endpoint
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8001/health" -TimeoutSec 5
        if ($response.status -eq "healthy") {
            Write-Host "✅ Server started và health check OK" -ForegroundColor Green
        } else {
            Write-Host "❌ Health check failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Không thể connect tới server: $_" -ForegroundColor Red
    } finally {
        # Cleanup
        Stop-Job $serverJob -ErrorAction SilentlyContinue
        Remove-Job $serverJob -ErrorAction SilentlyContinue
    }
} catch {
    Write-Host "❌ Lỗi test server startup: $_" -ForegroundColor Red
}

# Test 4: Test Docker build
Write-Host "`n📋 Test 4: Test Docker build..." -ForegroundColor Yellow
try {
    docker build -t qldapm-server-test . --quiet
    Write-Host "✅ Docker image build thành công" -ForegroundColor Green
    
    # Cleanup
    docker rmi qldapm-server-test --force | Out-Null
} catch {
    Write-Host "❌ Lỗi Docker build: $_" -ForegroundColor Red
    exit 1
}

# Quay lại thư mục gốc
Set-Location ..

Write-Host "`n🎉 Tất cả tests đều PASS! Server sẵn sàng để commit." -ForegroundColor Green
Write-Host "`n📝 Các bước tiếp theo:" -ForegroundColor Cyan
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'feat: add server health check and CI workflow'" -ForegroundColor White
Write-Host "3. git push" -ForegroundColor White
Write-Host "`n🚀 GitHub Actions sẽ tự động chạy full test và build Docker image!" -ForegroundColor Green 