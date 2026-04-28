
$ErrorActionPreference = "Stop"

$lines = Get-Content "d:\DevelopmentLocation\agent skill\skills\temp_readings\paths_html_extract.txt"
$targetDir = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String($lines[0]))
$outputJson = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String($lines[1]))


Add-Type -AssemblyName System.Web.Extensions
$serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$serializer.MaxJsonLength = 2147483647

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

$results = @{}

try {
    $files = Get-ChildItem -Path $targetDir -Include *.docx, *.doc -Recurse
    
    foreach ($file in $files) {
        if ($file.Name.StartsWith("~$")) { continue }
        
        Write-Host "Processing $($file.Name)"
        $doc = $word.Documents.Open($file.FullName)
        
        # Temp HTML path
        $tempHtml = [System.IO.Path]::Combine($targetDir, "temp_" + [System.Guid]::NewGuid().ToString() + ".html")
        
        # wdFormatFilteredHTML = 10
        $doc.SaveAs([ref]$tempHtml, [ref]10)
        $doc.Close()
        
        # Read HTML
        $htmlContent = Get-Content $tempHtml -Encoding UTF8 -Raw
        
        # Extract body
        if ($htmlContent -match "<body[^>]*>((.|\n)*?)</body>") {
            $body = $matches[1]
            # Clean up standard junk if needed, or keep as is.
            # Remove images for now if they cause bloat? User wanted images but let's stick to structure first.
            # Convert paths in HTML? 
            # For now, just store the raw body content.
            $results[$file.Name] = $body
        }
        
        Remove-Item $tempHtml -Force
    }
}
catch {
    Write-Host "Error: $_"
}
finally {
    $word.Quit()
}

$json = $serializer.Serialize($results)
Set-Content $outputJson $json -Encoding UTF8
Write-Host "Done"
