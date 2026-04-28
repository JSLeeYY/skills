
$ErrorActionPreference = "SilentlyContinue"
$basePath = "D:\Desktop\三方平台项目\三期需求"
Add-Type -AssemblyName System.Web.Extensions
$serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$serializer.MaxJsonLength = 2147483647

$output = @{}
$t = "Status"
$v = "Started"
$output[$t] = $v

function Get-ExcelContent {
    param($FilePath)
    $data = @{}
    try {
        $excel = New-Object -ComObject Excel.Application
        $excel.Visible = $false
        $excel.DisplayAlerts = $false
        $wb = $excel.Workbooks.Open($FilePath)
        foreach ($ws in $wb.Sheets) {
            $sheetData = @()
            $usedRange = $ws.UsedRange
            if ($usedRange.Cells.Count -gt 0) {
                $val = $usedRange.Value2
                
                if ($val -is [System.Array]) {
                    # 2D Array
                    $rows = $val.GetUpperBound(0)
                    $cols = $val.GetUpperBound(1)
                    
                    for ($r = 1; $r -le $rows; $r++) {
                        $rowData = @()
                        for ($c = 1; $c -le $cols; $c++) {
                            $v = $val[$r, $c]
                            if ($v -eq $null) { 
                                $v = "" 
                            }
                            $strV = [string]$v
                            $rowData += $strV
                        }
                        $joined = [string]::Join(" - ", $rowData)
                        $sheetData += $joined
                    }
                } else {
                    $sheetData += [string]$val
                }
            }
            $data[$ws.Name] = $sheetData
        }
        $wb.Close($false)
        $excel.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    } catch {
       # Ignore
    }
    return $data
}

function Get-WordContent {
    param($FilePath)
    $content = @{Text=""; Comments=@()}
    try {
        $word = New-Object -ComObject Word.Application
        $word.Visible = $false
        $doc = $word.Documents.Open($FilePath)
        
        $content.Text = $doc.Content.Text
        
        $cList = @()
        foreach ($cmt in $doc.Comments) {
            $cList += @{
                Author = $cmt.Author
                Text = $cmt.Range.Text
                Scope = $cmt.Scope.Text
            }
        }
        $content.Comments = $cList
        
        $doc.Close($false)
        $word.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    } catch {
       # Ignore
    }
    return $content
}

# 1. Exec Mgmt
$p1 = Join-Path $basePath "执行管理与经营分析需求表.xlsx"
if (Test-Path $p1) { $output["ExecMgmt"] = Get-ExcelContent -FilePath $p1 }

# 2. PECMS Main
$p2 = Join-Path $basePath "数字信息平台优化提升需求评估 - 三期确认稿.xlsx"
if (Test-Path $p2) { $output["PECMS_Main"] = Get-ExcelContent -FilePath $p2 }

# 3. PECMS Others
$otherExcels = @("预评价需求.xlsx", "后评价需求.xlsx")
foreach ($oe in $otherExcels) {
    $p = Join-Path $basePath $oe
    if (Test-Path $p) { $output["PECMS_Other_$oe"] = Get-ExcelContent -FilePath $p }
}

# 4. Word Reports
$reportPath = Join-Path $basePath "需求分析报告"
if (Test-Path $reportPath) {
    $docs = Get-ChildItem -Path $reportPath -Include "*.doc", "*.docx" -Recurse
    foreach ($d in $docs) {
        if ($d.Name -notlike "~$*") {
            $output["Report_$($d.Name)"] = Get-WordContent -FilePath $d.FullName
        }
    }
}

$outFile = Join-Path $basePath "extraction_result.json"
$json = $serializer.Serialize($output)
$json | Out-File -FilePath $outFile -Encoding UTF8
Write-Host "Done"
