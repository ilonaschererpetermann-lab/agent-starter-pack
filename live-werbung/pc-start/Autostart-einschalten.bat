@echo off
REM Einmalig ausfuehren: Studio startet danach automatisch beim Hochfahren des PCs
set "SC=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Herzloewen Studio.lnk"
powershell -NoProfile -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut($env:SC); $s.TargetPath='%~dp0Studio-Start.bat'; $s.WorkingDirectory='%~dp0'; $s.Save()"
echo Fertig: Das Studio startet ab jetzt automatisch mit dem PC.
pause
