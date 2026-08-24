param(
  [string]$ApiKey = $env:OPENAI_API_KEY,
  [string]$Model = "gpt-image-2",
  [string]$OutDir = "C:\Users\dev\Downloads\cyber crime website\ncrp\public\illustrations"
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$styleBase = "Minimal flat premium illustration in the visual style of Sarvam AI's brand system: a smooth color spectrum flowing from deep indigo blue (#2b46ce) through periwinkle and soft lilac to warm orange (#ff8a3d), geometric construction inspired by the symmetry of traditional Indian mandalas, thin clean circular line work, soft grain texture, generous negative space, calm civic-technology aesthetic, elegant and modern. Absolutely no text, no letters, no numbers, no words, no logos of existing brands."

$assets = @(
  @{
    File = "raksha-mandala-hero-v2.png"; Size = "1536x1024"; Background = "opaque"
    Prompt = "$styleBase A wide hero artwork: one large radiant mandala built from many concentric hand-drawn circles and petal arcs, centered slightly right, drawn in fine white and deep-blue lines over a soft background that washes from pale periwinkle blue at the bottom to warm peachy orange at the top. At the heart of the mandala sits a small minimal shield formed only by intersecting circular arcs, symbolising cyber protection for every Indian citizen. Faint dotted orbital rings and a few small circles floating around the mandala like a solar system. Light, airy, hopeful."
  },
  @{
    File = "raksha-monogram.png"; Size = "1024x1024"; Background = "transparent"
    Prompt = "$styleBase A single circular monogram logo mark on a transparent background: the letter-free symbol is built only from repeated overlapping circles forming a tiny mandala flower with a shield-like pointed arch in the middle, smooth gradient stroke flowing from indigo blue to warm orange, perfectly symmetrical, crisp vector look."
  },
  @{
    File = "illu-report.png"; Size = "1024x1024"; Background = "transparent"
    Prompt = "$styleBase Spot illustration on transparent background: a minimal document sheet whose outline is drawn with fine indigo lines, above it a small mandala rosette of repeated circles in blue-to-lilac gradient, a subtle checkmark made of a circular arc, symbolising filing a cyber crime report that is verified and clear."
  },
  @{
    File = "illu-voice.png"; Size = "1024x1024"; Background = "transparent"
    Prompt = "$styleBase Spot illustration on transparent background: a minimal microphone built from two nested circles and a thin arc stand, surrounded by concentric sound-wave rings forming half a mandala, gradient flowing from coral orange to warm saffron, symbolising speaking in your own Indian language, voice-first access."
  },
  @{
    File = "illu-atlas.png"; Size = "1024x1024"; Background = "transparent"
    Prompt = "$styleBase Spot illustration on transparent background: a circular radar-mandala, concentric dotted rings in periwinkle and lilac with one bold indigo orbit line, a small warning triangle replaced by a pointed-arch alert petal at the edge, symbolising a watchful threat bulletin that maps active scam patterns across India."
  },
  @{
    File = "illu-recover.png"; Size = "1024x1024"; Background = "transparent"
    Prompt = "$styleBase Spot illustration on transparent background: a gentle upward path of three ascending circular steps drawn with thin lines, topped by a small mandala sun in green-to-blue gradient with a circular arc checkmark, symbolising a visible recovery path after cyber fraud, money protected and restored."
  },
  @{
    File = "card-blue.png"; Size = "1536x1024"; Background = "opaque"
    Prompt = "$styleBase A wide decorative card background: rich gradient from deep indigo blue to soft periwinkle with subtle grain, in the center a faint large white line mandala of repeated circles and pointed-arch petals, drawn as thin delicate outlines, lots of empty space, premium fintech-civic feel."
  },
  @{
    File = "card-orange.png"; Size = "1536x1024"; Background = "opaque"
    Prompt = "$styleBase A wide decorative card background: warm gradient from saffron orange to soft peach with subtle grain, in the center a faint large white line lotus-mandala of repeated petals drawn as thin delicate outlines, lots of empty space, premium fintech-civic feel."
  },
  @{
    File = "card-violet.png"; Size = "1536x1024"; Background = "opaque"
    Prompt = "$styleBase A wide decorative card background: gradient from soft lilac violet to pale blue with subtle grain, in the center a faint large white line mandala of interlocking circles drawn as thin delicate outlines, lots of empty space, premium fintech-civic feel."
  }
)

$headers = @{ "Authorization" = "Bearer $ApiKey"; "Content-Type" = "application/json" }

foreach ($asset in $assets) {
  $outPath = Join-Path $OutDir $asset.File
  if (Test-Path $outPath) { Write-Output "SKIP $($asset.File) (exists)"; continue }
  $body = @{
    model = $Model
    prompt = $asset.Prompt
    size = $asset.Size
    quality = "high"
    output_format = "png"
  }
  if ($asset.Background -eq "transparent") { $body.background = "transparent" }
  Write-Output "GEN $($asset.File) ..."
  try {
    $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/images/generations" -Method Post -Headers $headers -Body ($body | ConvertTo-Json) -TimeoutSec 300
    if ($response.data[0].b64_json) {
      [IO.File]::WriteAllBytes($outPath, [Convert]::FromBase64String($response.data[0].b64_json))
      Write-Output "OK  $($asset.File) ($([math]::Round((Get-Item $outPath).Length/1kb)) KB)"
    } elseif ($response.data[0].url) {
      Invoke-WebRequest -Uri $response.data[0].url -OutFile $outPath -TimeoutSec 120
      Write-Output "OK  $($asset.File) (url) ($([math]::Round((Get-Item $outPath).Length/1kb)) KB)"
    } else {
      Write-Output "FAIL $($asset.File): no image payload"
    }
  } catch {
    Write-Output "FAIL $($asset.File): $($_.Exception.Message)"
    if ($_.ErrorDetails) { Write-Output $_.ErrorDetails.Message }
  }
}
Write-Output "DONE"
