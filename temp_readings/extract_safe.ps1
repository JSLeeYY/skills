
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
            $rowsData = @()
            $rng = $ws.UsedRange
            if ($rng.Cells.Count -gt 0) {
                # Read Value2
                $vals = $rng.Value2
                
                # Check if array
                if ($vals -is [System.Array]) {
                    $rCount = $vals.GetUpperBound(0)
                    $cCount = $vals.GetUpperBound(1)
                    
                    for ($i = 1; $i -le $rCount; $i++) {
                        $rowArr = @()
                        for ($j = 1; $j -le $cCount; $j++) {
                            $v = $vals[$i, $j]
                            if ($v -eq $null) { $v = "" }
                            # Simple string cast
                            $s = "$v" 
                            # Basic cleanup
                            $s = $s -replace "[\r\n]", " "
                            $rowArr += $s
                        }
                        $rowsData += [string]::Join("|", $rowArr)
                    }
                } else {
                    $rowsData += "$vals"
                }
            }
            $sheets[$ws.Name] = $rowsData
        }
        $wb.Close($false)
        $app.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($app) | Out-Null
    } catch {
        # Catch all
    }
    return $sheets
}

function Get-WordData {
    param($path)
    $docData = @{Text=""; Comments=@()}
    try {
        $app = New-Object -ComObject Word.Application
        $app.Visible = $false
        $doc = $app.Documents.Open($path)
        
        $docData["Text"] = $doc.Content.Text
        
        $cmts = @()
        foreach ($c in $doc.Comments) {
            $cmts += @{
                Auth = $c.Author
                Txt = $c.Range.Text
            }
        }
        $docData["Comments"] = $cmts
        
        $doc.Close($false)
        $app.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($app) | Out-Null
    } catch {
        # Catch all
    }
    return $docData
}

# Process target dir
if (Test-Path $targetDir) {
    # 1. Excel Files
    $excels = Get-ChildItem -Path $targetDir -Filter "*.xlsx"
    foreach ($x in $excels) {
        if ($x.Name.StartsWith("~$")) { continue }
        $output[$x.Name] = Get-ExcelData -path $x.FullName
    }

    # 2. Report Dir
    $subDir = Join-Path $targetDir "需求分析报告"
    if (Test-Path $subDir) {
        $docs = Get-ChildItem -Path $subDir -Include "*.doc", "*.docx" -Recurse
        foreach ($d in $docs) {
             if ($d.Name.StartsWith("~$")) { continue }
             $output[$d.Name] = Get-WordData -path $d.FullName
        }
    }
}

$jsonInfo = $serializer.Serialize($output)
$outFile = Join-Path $targetDir "extraction_full.json"
$jsonInfo | Out-File -FilePath $outFile -Encoding UTF8
