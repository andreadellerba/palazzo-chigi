# Avvia un piccolo server sul PC per giocare dall'iPhone (stessa rete Wi-Fi).
# Uso: tasto destro > "Esegui con PowerShell", poi apri su Safari l'indirizzo mostrato.
$port = 8080
$root = Join-Path $PSScriptRoot 'dist'
& (Join-Path $PSScriptRoot 'build.ps1') | Out-Host
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.*' -and $_.PrefixOrigin -ne 'WellKnown' } | Select-Object -First 1).IPAddress
Write-Host ""
Write-Host "Palazzo Chigi e' pronto." -ForegroundColor Yellow
Write-Host "Sull'iPhone apri Safari e vai su:  http://${ip}:${port}" -ForegroundColor Green
Write-Host "Poi Condividi > Aggiungi alla schermata Home. Chiudi questa finestra per fermare il server."
$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)
$listener.Start()
while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $line = $reader.ReadLine()
    while (($h = $reader.ReadLine()) -ne '' -and $h -ne $null) { }
    $path = '/PalazzoChigi.html'
    if ($line -match '^GET (/[^ ?]*)') { if ($Matches[1] -ne '/') { $path = $Matches[1] } }
    $file = Join-Path $root ($path.TrimStart('/'))
    if ((Test-Path $file -PathType Leaf) -and ((Resolve-Path $file).Path.StartsWith($root))) {
      $body = [IO.File]::ReadAllBytes($file); $status = '200 OK'
      $type = if ($file -like '*.html') { 'text/html; charset=utf-8' } else { 'application/octet-stream' }
    } else { $body = [Text.Encoding]::UTF8.GetBytes('Non trovato'); $status = '404 Not Found'; $type = 'text/plain' }
    $head = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($body.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n")
    $stream.Write($head, 0, $head.Length); $stream.Write($body, 0, $body.Length); $stream.Flush()
  } catch { } finally { $client.Close() }
}
