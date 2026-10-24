# Crea un unico file HTML (PalazzoChigi.html) con CSS e JS incorporati, da aprire sull'iPhone
$root = $PSScriptRoot
$html = [IO.File]::ReadAllText("$root\index.html")
$css = [IO.File]::ReadAllText("$root\css\style.css")
$html = $html.Replace('<link rel="stylesheet" href="css/style.css">', "<style>`n$css`n</style>")
$pattern = '<script src="(js/[^"]+)"></script>'
$html = [regex]::Replace($html, $pattern, {
  param($m)
  $js = [IO.File]::ReadAllText("$root\" + $m.Groups[1].Value.Replace('/', '\'))
  "<script>`n$js`n</script>"
})
$ico = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$root\img\icona-180.png"))
$html = $html.Replace('href="img/icona-180.png"', "href=`"data:image/png;base64,$ico`"")
New-Item -ItemType Directory -Force "$root\dist" | Out-Null
[IO.File]::WriteAllText("$root\dist\PalazzoChigi.html", $html, (New-Object Text.UTF8Encoding $false))
Write-Output ("Creato dist\PalazzoChigi.html ({0:N0} KB)" -f ((Get-Item "$root\dist\PalazzoChigi.html").Length / 1KB))
