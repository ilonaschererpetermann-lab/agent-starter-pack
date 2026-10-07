# Sucht FIFA / EA SPORTS FC auf dem PC (installierte Programme, Startmenü, EA-App, Steam, alle Laufwerke)
$ErrorActionPreference = 'SilentlyContinue'
$muster = 'FIFA|EA SPORTS FC|EA Sports FC|\bFC ?2[4-9]\b'
$funde = New-Object System.Collections.Generic.List[object]
function Fund($name, $pfad) { if ($pfad -and -not ($funde | Where-Object { $_.Pfad -eq $pfad })) { $funde.Add([pscustomobject]@{ Name = $name; Pfad = $pfad }) } }

Write-Host "Suche FIFA / EA SPORTS FC ... bitte kurz warten." -ForegroundColor Cyan

# 1. Installierte Programme (Registry)
$keys = 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*','HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*','HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*'
Get-ItemProperty $keys | Where-Object { $_.DisplayName -match $muster } | ForEach-Object {
  $exe = $null
  if ($_.InstallLocation) { $exe = Get-ChildItem $_.InstallLocation -Filter *.exe -File | Where-Object { $_.Name -match 'FIFA|FC2|FC ' } | Select-Object -First 1 -ExpandProperty FullName }
  Fund $_.DisplayName ($(if ($exe) { $exe } else { $_.InstallLocation }))
}

# 2. Startmenü-Verknüpfungen
$start = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs","$env:APPDATA\Microsoft\Windows\Start Menu\Programs","$env:USERPROFILE\Desktop","$env:PUBLIC\Desktop"
Get-ChildItem $start -Recurse -Include *.lnk,*.url | Where-Object { $_.BaseName -match $muster } | ForEach-Object { Fund $_.BaseName $_.FullName }

# 3. Typische Spiele-Ordner auf allen Laufwerken
$laufwerke = (Get-PSDrive -PSProvider FileSystem).Root
$ordner = 'Program Files\EA Games','Program Files (x86)\Origin Games','Program Files\Electronic Arts','Program Files (x86)\Steam\steamapps\common','Program Files\Steam\steamapps\common','SteamLibrary\steamapps\common','EA Games','Games'
foreach ($lw in $laufwerke) { foreach ($o in $ordner) {
  $p = Join-Path $lw $o
  if (Test-Path $p) { Get-ChildItem $p -Directory | Where-Object { $_.Name -match $muster } | ForEach-Object {
    $exe = Get-ChildItem $_.FullName -Filter *.exe -File | Where-Object { $_.Name -match 'FIFA|FC' } | Select-Object -First 1 -ExpandProperty FullName
    Fund $_.Name ($(if ($exe) { $exe } else { $_.FullName })) } }
} }

Write-Host ""
if ($funde.Count -eq 0) {
  Write-Host "Kein FIFA / EA SPORTS FC gefunden." -ForegroundColor Yellow
  Write-Host "Vermutlich nicht installiert. Über die EA app oder Steam (Bibliothek) neu herunterladen, wenn du es gekauft hast."
  Read-Host "Enter zum Beenden"; exit
}
Write-Host "Gefunden:" -ForegroundColor Green
for ($i = 0; $i -lt $funde.Count; $i++) { Write-Host ("  [{0}] {1}" -f ($i + 1), $funde[$i].Name) -ForegroundColor Green; Write-Host ("      {0}" -f $funde[$i].Pfad) }
Write-Host ""
$wahl = Read-Host "Nummer eingeben zum Starten (oder Enter zum Beenden)"
if ($wahl -match '^\d+$' -and [int]$wahl -ge 1 -and [int]$wahl -le $funde.Count) {
  $z = $funde[[int]$wahl - 1].Pfad
  if (Test-Path $z -PathType Container) { Start-Process explorer.exe $z } else { Start-Process $z }
  Write-Host "Wird gestartet ..." -ForegroundColor Cyan; Start-Sleep 2
}
