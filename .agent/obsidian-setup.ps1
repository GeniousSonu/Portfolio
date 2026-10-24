$cmd = Get-Command Obsidian.com -CommandType Application -ErrorAction SilentlyContinue
if ($cmd) { $cmd.Source }
$candidates = @(
    (Join-Path $env:LOCALAPPDATA 'Programs\Obsidian\Obsidian.com'),
    (Join-Path $env:ProgramFiles 'Obsidian\Obsidian.com')
)
foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate -PathType Leaf) { $candidate }
}
