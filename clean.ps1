$startDirectory = Get-Location

Write-Host "Deleting .next builds / caching folders..."
Get-ChildItem -Path $startDirectory -Recurse -Directory -Name '.next' | ForEach-Object {
    $dirPath = Join-Path $startDirectory $_
    Write-Host "Deleting $dirPath"
    Remove-Item -Path $dirPath -Recurse -Force
}

Write-Host "Deleting .turbo caching folders..."
Get-ChildItem -Path $startDirectory -Recurse -Directory -Name '.turbo' | ForEach-Object {
    $dirPath = Join-Path $startDirectory $_
    Write-Host "Deleting $dirPath"
    Remove-Item -Path $dirPath -Recurse -Force
}

Write-Host "Deleting node_modules folders..."
Get-ChildItem -Path $startDirectory -Recurse -Directory -Name 'node_modules' | ForEach-Object {
    $dirPath = Join-Path $startDirectory $_
    Write-Host "Deleting $dirPath"
    Remove-Item -Path $dirPath -Recurse -Force
}

Write-Host "Clearing npm cache..."
npm cache clean -f

Write-Host "Finished npm troubleshooting."
