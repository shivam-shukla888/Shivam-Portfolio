$source = Join-Path $PSScriptRoot "assets_source"
$dest = Join-Path $PSScriptRoot "public\images"
$files = @{
    "media__1773155120465.png" = "shivam.png"
    "media__1773155120475.png" = "vmitra.png"
    "media__1773155120528.png" = "sas_ai.png"
    "media__1773155120519.png" = "..\shivam_shukla_resume.png"
    "quickeats_dashboard_1773154489741.png" = "quickeats.png"
    "spring_security_icon_1773154867445.png" = "springsecurity.png"
    "postgresql_icon_1773154892511.png" = "postgresql.png"
    "git_icon_1773154911189.png" = "git.png"
    "github_icon_3d_1773154929064.png" = "github_3d.png"
    "intellij_icon_1773154947668.png" = "intellij.png"
}
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force }
foreach ($s in $files.Keys) {
    $srcFile = Join-Path $source $s
    $destFile = Join-Path $dest $files[$s]
    Write-Host "Copying $srcFile to $destFile"
    Copy-Item $srcFile $destFile -Force
}
Write-Host "Verification:"
get-childitem $dest | select Name
