# HerzGedanken – Mikrofon in Voicemeeter Banana automatisch einstellen
# Setzt am Mikrofon-Kanal (Hardware Input 1): Rauschfilter, Gate, Kompressor und leitet ihn auf B1 (für TikTok LIVE Studio).
# Voicemeeter muss geöffnet sein. Start über "Mikro einstellen.bat" (Doppelklick).

$ErrorActionPreference = 'Stop'
$pfade = @(
  "$env:ProgramFiles\VB\Voicemeeter\VoicemeeterRemote64.dll",
  "${env:ProgramFiles(x86)}\VB\Voicemeeter\VoicemeeterRemote64.dll"
)
$dll = $pfade | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $dll) { Write-Host "Voicemeeter wurde nicht gefunden. Bitte Voicemeeter Banana installieren." -ForegroundColor Red; Read-Host "Enter zum Beenden"; exit 1 }

Add-Type -TypeDefinition @"
using System; using System.Runtime.InteropServices;
public static class VM {
  [DllImport(@"$dll")] public static extern int VBVMR_Login();
  [DllImport(@"$dll")] public static extern int VBVMR_Logout();
  [DllImport(@"$dll")] public static extern int VBVMR_IsParametersDirty();
  [DllImport(@"$dll")] public static extern int VBVMR_RunVoicemeeter(int type);
  [DllImport(@"$dll")] public static extern int VBVMR_GetVoicemeeterType(ref int type);
  [DllImport(@"$dll", CharSet = CharSet.Ansi)] public static extern int VBVMR_SetParameterFloat(string name, float value);
}
"@

$r = [VM]::VBVMR_Login()
if ($r -lt 0) { Write-Host "Keine Verbindung zu Voicemeeter (Fehler $r)." -ForegroundColor Red; Read-Host "Enter zum Beenden"; exit 1 }
if ($r -eq 1) {
  # Voicemeeter läuft nicht: Banana selbst starten (64-Bit zuerst) und warten, bis es bereit ist
  Write-Host "Voicemeeter Banana wird gestartet ..." -ForegroundColor Yellow
  if ([VM]::VBVMR_RunVoicemeeter(5) -ne 0) { [VM]::VBVMR_RunVoicemeeter(2) | Out-Null }
  $bereit = $false
  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 500
    $t = 0
    if ([VM]::VBVMR_GetVoicemeeterType([ref]$t) -eq 0 -and $t -gt 0) { $bereit = $true; break }
  }
  if (-not $bereit) { Write-Host "Voicemeeter ließ sich nicht starten. Bitte Voicemeeter Banana von Hand öffnen und nochmal versuchen." -ForegroundColor Red; [VM]::VBVMR_Logout() | Out-Null; Read-Host "Enter zum Beenden"; exit 1 }
  Start-Sleep -Seconds 2
}
Start-Sleep -Milliseconds 300
[VM]::VBVMR_IsParametersDirty() | Out-Null

# Werte (0 bis 10). Bei Bedarf hier anpassen:
$einstellungen = [ordered]@{
  'Strip[0].Denoiser' = 5    # Rauschen, Lüfter, Brummen wegfiltern
  'Strip[0].Gate'     = 4    # stumm, wenn nicht gesprochen wird (Tastatur, Atmen)
  'Strip[0].Comp'     = 3    # gleichmäßige, "radio-artige" Stimme
  'Strip[0].Gain'     = 0    # keine zusätzliche Verstärkung
  'Strip[0].Mute'     = 0
  'Strip[0].B1'       = 1    # Mikrofon auf Ausgang B1 (TikTok: "Voicemeeter Out B1")
}
foreach ($k in $einstellungen.Keys) {
  $ok = [VM]::VBVMR_SetParameterFloat($k, [float]$einstellungen[$k])
  if ($ok -eq 0) { Write-Host ("OK   {0} = {1}" -f $k, $einstellungen[$k]) -ForegroundColor Green }
  else { Write-Host ("--   {0} wird von deiner Voicemeeter-Version nicht unterstützt (übersprungen)" -f $k) -ForegroundColor Yellow }
}
Start-Sleep -Milliseconds 300
[VM]::VBVMR_Logout() | Out-Null
Write-Host ""
Write-Host "Fertig! In TikTok LIVE Studio als Mikrofon 'Voicemeeter Out B1' wählen." -ForegroundColor Cyan
Write-Host "Tipp: Rauschunterdrückung in TikTok ausschalten (sonst wird doppelt gefiltert)."
Read-Host "Enter zum Beenden"
