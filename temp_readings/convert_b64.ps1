
$ErrorActionPreference = "SilentlyContinue"
$enc = [System.Text.Encoding]::Unicode

$lines = Get-Content "d:\DevelopmentLocation\agent skill\skills\temp_readings\paths.txt"
$h = $lines[0]
$d = $lines[1]


$htmlPath = $enc.GetString([System.Convert]::FromBase64String($h))
$docxPath = $enc.GetString([System.Convert]::FromBase64String($d))

Write-Host "Paths:"
Write-Host $htmlPath
Write-Host $docxPath

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0 

try {
    if (Test-Path $docxPath) { Remove-Item $docxPath -Force }
    $doc = $word.Documents.Open($htmlPath)
    $doc.SaveAs([ref]$docxPath, [ref]16)
    $doc.Close()
    Write-Host "Success"
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
}
