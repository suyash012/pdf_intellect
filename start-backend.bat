@echo off
echo Starting PDF Intellect Backend...
cd backend
call .\venv\Scripts\activate
uvicorn app.main:app --reload 