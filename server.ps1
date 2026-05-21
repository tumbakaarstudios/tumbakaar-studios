# Lightweight PowerShell HTTP Server
$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "Server started successfully on http://localhost:$port/" -ForegroundColor Green
    Write-Host "Press Ctrl+C or stop the background command to terminate." -ForegroundColor Yellow
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }
        
        # Build local path
        $localPath = Join-Path (Get-Location) $urlPath
        
        try {
            # Check if file exists
            if (Test-Path $localPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $mimeType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css" }
                    ".js"   { "application/javascript" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".webp" { "image/webp" }
                    ".mp4"  { "video/mp4" }
                    ".svg"  { "image/svg+xml" }
                    default { "application/octet-stream" }
                }
                
                $response.ContentType = $mimeType
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                
                # Read bytes and write
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found: $urlPath")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.OutputStream.Close()
        } catch {
            # Catch client aborted connections gracefully without terminating the server loop
            try { $response.OutputStream.Close() } catch {}
        }
    }
} catch {
    Write-Error $_
} finally {
    $listener.Stop()
}
