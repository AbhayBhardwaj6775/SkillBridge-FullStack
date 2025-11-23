# Test script to verify servers are running

Write-Host "Testing Career Pathway Analyzer Servers..." -ForegroundColor Cyan
Write-Host ""

# Test Backend
Write-Host "1. Testing Backend (http://localhost:5000)..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get -ErrorAction Stop
    Write-Host "   ✓ Backend is running!" -ForegroundColor Green
    Write-Host "   Response: $($backendResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Backend is NOT running" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test Frontend (check multiple ports as Next.js may use different ports)
Write-Host "2. Testing Frontend..." -ForegroundColor Yellow
$frontendPorts = @(3000, 3001, 3002)
$frontendRunning = $false

foreach ($port in $frontendPorts) {
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:$port" -Method Get -ErrorAction Stop -TimeoutSec 3
        Write-Host "   ✓ Frontend is running on port $port!" -ForegroundColor Green
        Write-Host "   Status: $($frontendResponse.StatusCode)" -ForegroundColor Gray
        $frontendRunning = $true
        break
    } catch {
        # Try next port
    }
}

if (-not $frontendRunning) {
    Write-Host "   ✗ Frontend is NOT running on ports 3000-3002" -ForegroundColor Red
    Write-Host "   Please start it with: cd frontend && npm run dev" -ForegroundColor Yellow
}
Write-Host ""

# Test API Endpoints
Write-Host "3. Testing API Endpoints..." -ForegroundColor Yellow
try {
    $testData = @{
        targetRole = "Backend Developer"
        currentSkills = "Java, SQL, Git"
    } | ConvertTo-Json
    
    $skillGapResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/skill-gap" -Method Post -Body $testData -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✓ Skill Gap API is working!" -ForegroundColor Green
    Write-Host "   Matched Skills: $($skillGapResponse.matchedSkills -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Skill Gap API failed" -ForegroundColor Red
}

try {
    $roadmapData = @{
        targetRole = "Backend Developer"
    } | ConvertTo-Json
    
    $roadmapResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/roadmap" -Method Post -Body $roadmapData -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✓ Roadmap API is working!" -ForegroundColor Green
    Write-Host "   Phases: $($roadmapResponse.roadmap.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Roadmap API failed" -ForegroundColor Red
}

try {
    $newsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/news" -Method Get -ErrorAction Stop
    Write-Host "   ✓ News API is working!" -ForegroundColor Green
    Write-Host "   Stories: $($newsResponse.stories.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ News API failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "If servers are not running, start them with:" -ForegroundColor Yellow
Write-Host "  Backend:  cd backend && npm start" -ForegroundColor White
Write-Host "  Frontend: cd frontend && npm run dev" -ForegroundColor White

