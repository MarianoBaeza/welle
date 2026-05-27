# Genera los ZIPs de las 3 librerías para subir a Cloudflare R2
# Ejecutar desde la raíz del repo: .\scripts\create-zips.ps1

$source = "c:\dev\Mora\welle-material\libraries"
$output = "c:\dev\Mora\welle-material\zips"

$libraries = @(
    @{ Folder = "ASMR";      Slug = "asmr" },
    @{ Folder = "CC";        Slug = "content-creator" },
    @{ Folder = "Cinematic"; Slug = "cinematic" }
)

New-Item -ItemType Directory -Force -Path $output | Out-Null

foreach ($lib in $libraries) {
    $src = Join-Path $source $lib.Folder
    $dest = Join-Path $output "$($lib.Slug).zip"

    if (Test-Path $dest) {
        Write-Host "[$($lib.Slug)] Ya existe, salteando. Borrar para regenerar."
        continue
    }

    Write-Host "[$($lib.Slug)] Comprimiendo $src..."
    Compress-Archive -Path "$src\*" -DestinationPath $dest -CompressionLevel Optimal
    $sizeMB = [math]::Round((Get-Item $dest).Length / 1MB, 1)
    Write-Host "[$($lib.Slug)] Listo → $dest ($sizeMB MB)"
}

Write-Host ""
Write-Host "ZIPs en: $output"
Write-Host "Subir a R2 bucket 'welle-downloads' con los nombres: asmr.zip, content-creator.zip, cinematic.zip"
