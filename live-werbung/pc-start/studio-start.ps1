# Herzloewen Studio-Start: oeffnet alles fuer das Live mit einem Klick.
# Programme werden ueber ihre Startmenue-Verknuepfungen gefunden, egal wo sie installiert sind.

$Board    = "https://claude.ai/artifact/Wkidu4YsxYbtJo9oW4tLtd"
$Claude   = "https://claude.ai/code"
$TikFinityWeb = "https://tikfinity.zerody.one"

$menus = @("$env:APPDATA\Microsoft\Windows\Start Menu\Programs",
           "$env:ProgramData\Microsoft\Windows\Start Menu\Programs",
           "$env:USERPROFILE\Desktop", "$env:PUBLIC\Desktop")

function Find-App($pattern) {
  foreach ($m in $menus) {
    if (Test-Path $m) {
      $hit = Get-ChildItem -Path $m -Recurse -Filter "*.lnk" -ErrorAction SilentlyContinue |
             Where-Object { $_.BaseName -like $pattern } | Select-Object -First 1
      if ($hit) { return $hit.FullName }
    }
  }
  return $null
}

function Start-App($name, $pattern, $fallbackUrl) {
  $proc = Get-Process | Where-Object { $_.MainWindowTitle -like $pattern -or $_.ProcessName -like ($pattern -replace ' ', '') } | Select-Object -First 1
  if ($proc) { Write-Host "laeuft schon: $name"; return }
  $lnk = Find-App $pattern
  if ($lnk) { Start-Process $lnk; Write-Host "gestartet: $name" }
  elseif ($fallbackUrl) { Start-Process $fallbackUrl; Write-Host "im Browser geoeffnet: $name" }
  else { Write-Host "NICHT gefunden: $name (bitte Claude Bescheid sagen)" }
  Start-Sleep -Seconds 2
}

Write-Host "=== Herzloewen Studio startet ===" -ForegroundColor Yellow
Start-App "Voicemeeter"         "*Voicemeeter Banana*" $null
Start-App "Stream Deck"         "*Stream Deck*"        $null
Start-App "TikFinity"           "*TikFinity*"          $TikFinityWeb
Start-App "TikTok LIVE Studio"  "*TikTok LIVE Studio*" $null

# Studio-Board als eigenes App-Fenster (ohne Browserleiste), dazu Claude
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe" }
if (Test-Path $edge) { Start-Process $edge "--app=$Board" } else { Start-Process $Board }
$claudeApp = Find-App "Claude"
if ($claudeApp) { Start-Process $claudeApp } else { Start-Process $Claude }

Write-Host "=== Alles offen. Viel Erfolg, Herzloewin! ===" -ForegroundColor Green
Start-Sleep -Seconds 4
