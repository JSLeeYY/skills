
$ErrorActionPreference = "SilentlyContinue"
param([string]$targetDir)
Add-Type -AssemblyName System.Web.Extensions
$serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$serializer.MaxJsonLength = 2147483647
$output = @{}
$output["Status"] = "Running"
function Get-ExcelData {
    param($path)
    $sheets = @{}
    try {
        $app = New-Object -ComObject Excel.Application
        $app.Visible = $false
        $app.DisplayAlerts = $false
        $wb = $app.Workbooks.Open($path)
        foreach ($ws in $wb.Sheets) {
            $rows = @()
            if ($ws.UsedRange.Cells.Count -gt 0) {
                $vals = $ws.UsedRange.Value2
                if ($vals -is [System.Array]) {
                    $rC = $vals.GetUpperBound(0)
                    $cC = $vals.GetUpperBound(1)
                    for ($i = 1; $i -le $rC; $i++) {
                        $row = @()
                        for ($j = 1; $j -le $cC; $j++) {
                            $v = $vals[$i, $j]
                            if ($v -eq $null) { $v = "" }
                            $row += [string]$v
                        }
                        $rows += [string]::Join("|", $row)
                    }
                } else { $rows += [string]$vals }
            }
            $sheets[$ws.Name] = $rows
        }
        $wb.Close($false)
        $app.Quit()
    } catch {}
    return $sheets
}
function Get-WordData {
    param($path)
    $d = @{Text=""; Comments=@()}
    try {
        $app = New-Object -ComObject Word.Application
        $app.Visible = $false
        $doc = $app.Documents.Open($path)
        $d["Text"] = $doc.Content.Text
        $cs = @()
        foreach ($c in $doc.Comments) {
            $cs += @{A=$c.Author; T=$c.Range.Text}
        }
        $d["Comments"] = $cs
        $doc.Close($false)
        $app.Quit()
    } catch {}
    return $d
}
if (Test-Path $targetDir) {
    $xs = Get-ChildItem -Path $targetDir -Filter "*.xlsx"
    foreach ($x in $xs) {
        if (!$x.Name.StartsWith("~$")) {
            $output[$x.Name] = Get-ExcelData -path $x.FullName
        }
    }
    $sd = Join-Path $targetDir "需求分析报告"
    if (Test-Path $sd) {
        $ds = Get-ChildItem -Path $sd -Include "*.doc", "*.docx" -Recurse
        foreach ($doc in $ds) {
             if (!$doc.Name.StartsWith("~$")) {
                 $output[$doc.Name] = Get-WordData -path $doc.FullName
             }
        }
    }
}
$j = $serializer.Serialize($output)
$f = Join-Path $targetDir "extraction.json"
$j | Out-File -FilePath $f -Encoding UTF8
