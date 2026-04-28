
$ErrorActionPreference = "Stop"
$htmlPath = "D:\Desktop\三方平台项目\三期需求\report.html"
$docxPath = "D:\Desktop\三方平台项目\三期需求\数字一体化平台需求完整分析.docx"

if (Test-Path $docxPath) { Remove-Item $docxPath -Force }

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0 # wdAlertsNone

try {
    $absHtml = (Resolve-Path $htmlPath).Path
    Write-Host "Opening $absHtml"
    $doc = $word.Documents.Open($absHtml)
    
    # Save
    Write-Host "Saving to $docxPath"
    $doc.SaveAs([ref]$docxPath, [ref]16)
    $doc.Close()
    Write-Host "Success"
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
}
