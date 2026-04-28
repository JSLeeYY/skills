
Continue = 'SilentlyContinue'
param([string])
Add-Type -AssemblyName System.Web.Extensions
 = New-Object System.Web.Script.Serialization.JavaScriptSerializer
.MaxJsonLength = 2147483647
 = @{}
['Status'] = 'Running'

function Get-ExcelData {
    param()
     = @{}
    try {
         = New-Object -ComObject Excel.Application
        .Visible = False
        .DisplayAlerts = False
         = .Workbooks.Open()
        foreach ( in .Sheets) {
             = @()
             = .UsedRange
            if (.Cells.Count -gt 0) {
                 = .Value2
                if ( -is [System.Array]) {
                     = .GetUpperBound(0)
                     = .GetUpperBound(1)
                    for ( = 1;  -le ; ++) {
                         = @()
                        for ( = 1;  -le ; ++) {
                             = [, ]
                            if ( -eq ) {  = '' }
                             = .ToString()
                             += 
                        }
                         += [string]::Join('|', )
                    }
                } else {
                     += .ToString()
                }
            }
            [.Name] = 
        }
        .Close(False)
        .Quit()
    } catch {}
    return 
}

function Get-WordData {
    param()
     = @{Text=''; Comments=@()}
    try {
         = New-Object -ComObject Word.Application
        .Visible = False
         = .Documents.Open()
        ['Text'] = .Content.Text
         = @()
        foreach ( in .Comments) {
             += @{Auth=.Author; Txt=.Range.Text}
        }
        ['Comments'] = 
        .Close(False)
        .Quit()
    } catch {}
    return 
}

if (Test-Path ) {
     = Get-ChildItem -Path  -Filter '*.xlsx'
    foreach ( in ) {
        if (.Name.StartsWith('~$')) { continue }
        [.Name] = Get-ExcelData -path .FullName
    }
     = Join-Path  '需求分析报告'
    if (Test-Path ) {
         = Get-ChildItem -Path  -Include '*.doc', '*.docx' -Recurse
        foreach ( in ) {
             if (.Name.StartsWith('~$')) { continue }
             [.Name] = Get-WordData -path .FullName
        }
    }
}
 = .Serialize()
 = Join-Path  'extraction_full.json'
 | Out-File -FilePath  -Encoding UTF8
