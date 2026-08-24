param(
  [string]$ApiKey,
  [string]$OutDir = "C:\Users\dev\Downloads\cyber crime website\ncrp\public\illustrations\icons"
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$styleBase = "Elegant icon illustration drawn in thin luminous lines that flow from indigo blue to warm saffron orange, on a transparent background. Construction grammar: Indian pointed-arch (jharokha) shapes, concentric circles, dotted rings. Minimal, symmetrical, premium civic-technology icon, soft glow, no text, no letters, no watermark."

$icons = @(
  @{ File = "icon-emergency.png"; Prompt = "$styleBase A telephone handset drawn inside a pointed-arch frame, three radiating sound arcs rising above it, one small alert dot at the arch peak. Urgency, helpline call." },
  @{ File = "icon-lost.png"; Prompt = "$styleBase A wallet with a pointed-arch clasp, a circular rewind arrow curving around it, one small droplet falling. Money already lost, starting recovery." },
  @{ File = "icon-check.png"; Prompt = "$styleBase A magnifying glass whose round lens is a pointed-arch window containing a small question spark, handle extending down-right. Checking something suspicious." },
  @{ File = "icon-route.png"; Prompt = "$styleBase A pointed-arch document sheet at the center with a small seal circle, three thin lines routing out from its base to three small circles arranged below like destinations. One report routed to many recipients." },
  @{ File = "icon-speak.png"; Prompt = "$styleBase A microphone capsule standing under a small pointed arch, wrapped in three concentric sound-wave rings. Voice-first, speak your own language." },
  @{ File = "icon-path.png"; Prompt = "$styleBase Three ascending pointed-arch steps climbing from left to right, a small radiant circle sun with a checkmark arc rising above the last step. A visible recovery path." }
)

$headers = @{ "Authorization" = "Bearer $ApiKey"; "Content-Type" = "application/json" }

foreach ($icon in $icons) {
  $outPath = Join-Path $OutDir $icon.File
  if (Test-Path $outPath) { Write-Output "SKIP $($icon.File)"; continue }
  $body = @{ model = "gpt-image-1-mini"; prompt = $icon.Prompt; size = "1024x1024"; quality = "high"; output_format = "png"; background = "transparent" } | ConvertTo-Json
  Write-Output "GEN $($icon.File) ..."
  try {
    $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/images/generations" -Method Post -Headers $headers -Body $body -TimeoutSec 300
    [IO.File]::WriteAllBytes($outPath, [Convert]::FromBase64String($response.data[0].b64_json))
    Write-Output "OK  $($icon.File) ($([math]::Round((Get-Item $outPath).Length/1kb)) KB)"
  } catch {
    Write-Output "FAIL $($icon.File): $($_.Exception.Message)"
  }
}
Write-Output "DONE"
