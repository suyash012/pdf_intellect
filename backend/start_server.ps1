Set-Location -Path $PSScriptRoot
Write-Host "Starting the backend server from $(Get-Location)"

# Use python.exe if it exists, otherwise use python3.exe
$pythonPath = ".\venv\Scripts\python.exe"
if (-not (Test-Path $pythonPath)) {
    $pythonPath = ".\venv\Scripts\python3.exe"
}

if (Test-Path $pythonPath) {
    & $pythonPath -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
} else {
    Write-Host "Error: Python executable not found at $pythonPath" -ForegroundColor Red
    Write-Host "Make sure your virtual environment is set up correctly" -ForegroundColor Red
} 