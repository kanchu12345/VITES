Add-Type -AssemblyName System.Drawing

$images = Get-ChildItem -Path "G:\fasion\img" -Include *.jpg,*.jpeg,*.png -Recurse | Where-Object { $_.Length -gt 1MB }

if ($images.Count -eq 0) {
    Write-Host "No images over 1MB found."
    exit
}

foreach ($img in $images) {
    Write-Host "Compressing $($img.Name) (Size: $([math]::Round($img.Length / 1MB, 2)) MB)..."
    
    try {
        # Create a copy of the file in memory to avoid locking the original
        $fs = New-Object System.IO.FileStream($img.FullName, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read)
        $bmp = [System.Drawing.Bitmap]::FromStream($fs)
        $fs.Close()
        
        # Calculate new size (max width 1200 for web banners/products)
        $newWidth = $bmp.Width
        $newHeight = $bmp.Height
        if ($newWidth -gt 1200) {
            $ratio = 1200.0 / $bmp.Width
            $newWidth = 1200
            $newHeight = [int]($bmp.Height * $ratio)
        }

        $newBmp = New-Object System.Drawing.Bitmap $newWidth, $newHeight
        $graphics = [System.Drawing.Graphics]::FromImage($newBmp)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        
        # Fill background with white in case of transparent PNG
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.DrawImage($bmp, 0, 0, $newWidth, $newHeight)
        $graphics.Dispose()
        $bmp.Dispose()
        
        # Save as JPEG with 75% quality
        $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
        $jpegCodec = $codecs | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 75L)
        
        $tempPath = $img.FullName + ".tmp"
        $newBmp.Save($tempPath, $jpegCodec, $encoderParams)
        $newBmp.Dispose()
        
        # Replace original file
        Remove-Item $img.FullName -Force
        Rename-Item $tempPath $img.Name
        
        Write-Host "Successfully compressed $($img.Name)"
    } catch {
        Write-Host "Failed to compress $($img.Name): $_"
    }
}
Write-Host "Compression complete."
