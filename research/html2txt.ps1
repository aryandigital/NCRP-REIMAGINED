param([string]$Dir = ".")
Get-ChildItem -Path $Dir -Filter *.html | ForEach-Object {
  $h = Get-Content $_.FullName -Raw -Encoding UTF8
  $h = [regex]::Replace($h, '(?s)<script.*?</script>', ' ')
  $h = [regex]::Replace($h, '(?s)<style.*?</style>', ' ')
  $h = [regex]::Replace($h, '(?s)<svg.*?</svg>', ' ')
  $h = [regex]::Replace($h, '(?s)<!--.*?-->', ' ')
  $h = [regex]::Replace($h, '</(p|div|li|h1|h2|h3|h4|tr|section|article|pre|blockquote)>', "`n")
  $h = [regex]::Replace($h, '<br\s*/?>', "`n")
  $h = [regex]::Replace($h, '<[^>]+>', '')
  $h = [System.Net.WebUtility]::HtmlDecode($h)
  $h = [regex]::Replace($h, '[ \t]+', ' ')
  $h = [regex]::Replace($h, '(\r?\n[ \t]*){3,}', "`n`n")
  $out = Join-Path $_.DirectoryName ($_.BaseName + '.txt')
  Set-Content -Path $out -Value $h.Trim() -Encoding UTF8
}
Write-Output "converted"
