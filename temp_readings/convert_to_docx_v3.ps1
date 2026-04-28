
$ErrorActionPreference = "Stop"

$lines = Get-Content "d:\DevelopmentLocation\agent skill\skills\temp_readings\paths.txt"
$htmlPath = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String($lines[0]))
$docxPath = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String($lines[1]))


if (Test-Path $docxPath) { Remove-Item $docxPath -Force }

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0 

try {
    $absHtml = (Resolve-Path $htmlPath).Path
    Write-Host "Opening $absHtml"
    $doc = $word.Documents.Open($absHtml)
    

    # Page Setup
    # 1.27 cm margins
    $doc.PageSetup.LeftMargin = $word.CentimetersToPoints(1.27)
    $doc.PageSetup.RightMargin = $word.CentimetersToPoints(1.27)
    $doc.PageSetup.TopMargin = $word.CentimetersToPoints(1.27)
    $doc.PageSetup.BottomMargin = $word.CentimetersToPoints(1.27)

    # Orientation to Landscape (wdOrientLandscape = 1)
    $doc.PageSetup.Orientation = 1 


    # Fix Tables
    foreach ($tbl in $doc.Tables) {
        # wdAutoFitWindow = 2
        $tbl.AutoFitBehavior(2)
        
        # Set Borders explicitly
        $tbl.Borders.InsideLineStyle = 1 # wdLineStyleSingle
        $tbl.Borders.OutsideLineStyle = 1
    }

    Write-Host "Saving to $docxPath"
    $doc.SaveAs([ref]$docxPath, [ref]16)
    $doc.Close()
    Write-Host "Success"
} catch {
    Write-Host "Error: $_"
} finally {
    if ($word) { $word.Quit() }
}
