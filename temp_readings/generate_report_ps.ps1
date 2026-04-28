
$ErrorActionPreference = "SilentlyContinue"
param([string]$jsonPath, [string]$docxPath)

Add-Type -AssemblyName System.Web.Extensions
$serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$serializer.MaxJsonLength = 2147483647

if (!(Test-Path $jsonPath)) {
    Write-Host "JSON not found"
    exit
}

$content = Get-Content $jsonPath -Encoding UTF8 -Raw
$data = $serializer.DeserializeObject($content)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()

function Add-Heading {
    param($text, $level)
    $para = $doc.Content.Paragraphs.Add()
    $para.Range.Text = $text
    $para.Range.Style = "标题 $level" 
    if ($level -eq 1) { $para.Range.Font.Size = 16; $para.Range.Font.Bold = 1 }
    $para.Range.InsertParagraphAfter()
}

function Add-Text {
    param($text, $color=0)
    if ([string]::IsNullOrWhiteSpace($text)) { return }
    $para = $doc.Content.Paragraphs.Add()
    $para.Range.Text = $text
    $para.Range.Font.Size = 11
    if ($color -ne 0) { $para.Range.Font.Color = $color }
    $para.Range.InsertParagraphAfter()
}

function Add-Table {
    param($rowsData)
    if ($rowsData.Count -eq 0) { return }
    
    $maxCols = 0
    $rowsData | ForEach-Object {
        $cols = $_.Split("|").Count
        if ($cols -gt $maxCols) { $maxCols = $cols }
    }
    
    if ($maxCols -eq 0) { return }

    $rng = $doc.Content.Paragraphs.Add().Range
    $table = $doc.Tables.Add($rng, $rowsData.Count, $maxCols)
    $table.Borders.Enable = $true
    
    for ($i = 0; $i -lt $rowsData.Count; $i++) {
        $cells = $rowsData[$i].Split("|")
        for ($j = 0; $j -lt $cells.Count; $j++) {
            $val = $cells[$j]
            if ($val.Length -gt 250) { $val = $val.Substring(0, 250) + "..." }
            $table.Cell($i+1, $j+1).Range.Text = $val
        }
    }
    $doc.Content.Paragraphs.Add().Range.InsertParagraphAfter()
}

# Config
$mContent = Get-Content "d:\DevelopmentLocation\agent skill\skills\temp_readings\mapping.json" -Encoding UTF8 -Raw
$config = $serializer.DeserializeObject($mContent)
$map = $config["map"]

# Main Title
$t = $doc.Content.Paragraphs.Add()
$t.Range.Text = $config["title"]
$t.Range.Font.Size = 24
$t.Range.Font.Bold = 1
$t.Alignment = 1 # Center
$t.Range.InsertParagraphAfter()

$processed = @()

# 1. Mapped Excel
foreach ($key in $map.Keys) {
    if ($data.ContainsKey($key)) {
        Add-Heading -text $map[$key] -level 1
        $sheetData = $data[$key]
        foreach ($sheetName in $sheetData.Keys) {
            Add-Heading -text $sheetName -level 2
            Add-Table -rowsData $sheetData[$sheetName]
        }
        $processed += $key
    }
}

# 2. Others
Add-Heading -text $config["report_section_title"] -level 1
foreach ($key in $data.Keys) {
    if ($key -eq "Status" -or $processed -contains $key) { continue }
    
    Add-Heading -text $key -level 2
    $item = $data[$key]
    
    if ($item.ContainsKey("Text")) {
        Add-Text -text $item["Text"]
    }
    if ($item.ContainsKey("Comments")) {
        Add-Heading -text $config["comment_section_title"] -level 3
        foreach ($c in $item["Comments"]) {
            $txt = $config["lb"] + $c["A"] + $config["rb"] + $c["T"]
            Add-Text -text $txt -color 255 
        }
    }
    if (!($item.ContainsKey("Text"))) {
         foreach ($k in $item.Keys) {
             if ($item[$k] -is [System.Array]) {
                 Add-Heading -text $k -level 3
                 Add-Table -rowsData $item[$k]
             }
         }
    }
}

$doc.SaveAs([ref]$docxPath)
$doc.Close()
$word.Quit()
