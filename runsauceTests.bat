@echo off
echo Running All Sauce Demo Playwright Tests...
cd /d %~dp0
call npm install
call npx playwright install
call npx playwright test tests/e2e/sauce-demo/
call npx playwright show-report
pause
