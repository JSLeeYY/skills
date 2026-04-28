
$ErrorActionPreference = "SilentlyContinue"
$htmlPath = "D:\Desktop\三方平台项目\三期需求\report.html"
$docxPath = "D:\Desktop\三方平台项目\三期需求\数字一体化平台需求完整分析.docx"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open($htmlPath)
    $doc.SaveAs([ref]$docxPath, [ref]16)
    $doc.Close()
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
}
