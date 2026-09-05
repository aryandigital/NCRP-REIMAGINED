# deploy.ps1 ??? mirror local ncrp/ into the ncrp-reimagined/ folder of the
# GitHub repo and push to main. Always clones fresh (pull-first), so teammate
# changes on main are never clobbered. Requires: git with cached GitHub creds.
#
# Usage:  powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 "commit message"

param(
  [Parameter(Mandatory = $true)][string]$Message,
  [string]$Repo = "https://github.com/aryandigital/ncrp-reimagined.git",
  [string]$Branch = "main",
  [string]$Subdir = "ncrp-reimagined"
)

$ErrorActionPreference = "Stop"
$src = Split-Path -Parent $PSScriptRoot   # the local ncrp/ folder
$work = Join-Path $env:TEMP ("raksha-deploy-" + [guid]::NewGuid().ToString("N").Substring(0, 8))

Write-Host "==> Pull-first: cloning fresh $Repo ($Branch)" -ForegroundColor Cyan
git clone --depth 50 --branch $Branch $Repo $work
if ($LASTEXITCODE -ne 0) { throw "clone failed" }

$dst = Join-Path $work $Subdir
New-Item -ItemType Directory -Force $dst | Out-Null

Write-Host "==> Mirroring $src -> $Subdir/ (excluding secrets/artifacts)" -ForegroundColor Cyan
robocopy $src $dst /MIR /XD node_modules .next .git out build .vercel .gstack /XF .env.local .env.development.local .env.test.local .env.production.local *.tsbuildinfo next-env.d.ts dev-server.log /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -gt 7) { throw "robocopy failed: $LASTEXITCODE" }

Push-Location $work
try {
  git add -A
  $pending = git status --porcelain
  if (-not $pending) { Write-Host "==> Nothing to deploy; local already matches $Branch." -ForegroundColor Yellow; exit 0 }

  if ($pending -match '\.env\.local') { throw "SAFETY: .env.local would be committed ??? aborting" }

  git commit -q -m $Message
  Write-Host "==> Pushing to $Branch" -ForegroundColor Cyan
  git push origin ("HEAD:" + $Branch)
  if ($LASTEXITCODE -ne 0) {
    Write-Host "!! Push rejected ??? someone pushed first. Re-run this script (it re-clones fresh)." -ForegroundColor Red
    exit 1
  }
  Write-Host "==> Pushed. If Vercel is connected to this repo, a deploy starts now." -ForegroundColor Green
} finally {
  Pop-Location
  Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
}
