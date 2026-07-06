@echo off
echo Starting Python HTTP Server on port 8000...
echo.
echo Server URL: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause