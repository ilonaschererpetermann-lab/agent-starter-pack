# Herzloewen Studio - Installation
# Kopiert alle Dateien nach C:\Herzloewen und legt Desktop-Verknuepfungen an.
$ErrorActionPreference = "Stop"
$src  = Join-Path $PSScriptRoot "Dateien"
$dest = "C:\Herzloewen"
Write-Host ""
Write-Host "=== Herzloewen Studio wird installiert ===" -ForegroundColor Yellow
try {
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Copy-Item -Path (Join-Path $src "*") -Destination $dest -Recurse -Force
  Write-Host "Dateien kopiert nach $dest" -ForegroundColor Green

  $desktop = [Environment]::GetFolderPath("Desktop")
  $shell = New-Object -ComObject WScript.Shell
  $lnk = $shell.CreateShortcut((Join-Path $desktop "Herzloewen Studio starten.lnk"))
  $lnk.TargetPath = Join-Path $dest "pc-start\Studio-Start.bat"
  $lnk.WorkingDirectory = Join-Path $dest "pc-start"
  $lnk.IconLocation = "shell32.dll,137"
  $lnk.Save()
  $lnk2 = $shell.CreateShortcut((Join-Path $desktop "Herzloewen Dateien.lnk"))
  $lnk2.TargetPath = $dest
  $lnk2.Save()
  Write-Host "Desktop-Verknuepfungen angelegt" -ForegroundColor Green

  if (Test-Path (Join-Path $dest "StreamDeck\Belegung-StreamDeck.png")) { Start-Process (Join-Path $dest "StreamDeck\Belegung-StreamDeck.png") }
  if (Test-Path (Join-Path $dest "StreamDeck")) { Start-Process (Join-Path $dest "StreamDeck") }
  Write-Host ""
  Write-Host "=== FERTIG! ===" -ForegroundColor Green
  Write-Host "Auf dem Desktop: 'Herzloewen Studio starten' und 'Herzloewen Dateien'."
  Write-Host "Der Stream-Deck-Ordner und die Belegung sind jetzt offen."
} catch {
  Write-Host ""
  Write-Host "FEHLER: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "Bitte Screenshot von diesem Fenster an Claude schicken."
}
Write-Host ""
Read-Host "Zum Schliessen Enter druecken"
