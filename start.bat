@echo off
cd /d "%~dp0"
echo FluentPath is starting at http://localhost:5173  (close this window to stop)
start "" http://localhost:5173/index.html
python -m http.server 5173 --bind 127.0.0.1
