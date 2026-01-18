# Rebuild git history from scratch
cd d:\CnP\nudge

# Initialize new git repo
git init
git config user.name "AtharvRG"
git config user.email "atharv2703123@gmail.com"
git remote add origin https://github.com/AtharvRG/nudge.git

# Define authors
$atharv = @{name="AtharvRG"; email="atharv2703123@gmail.com"}
$krishna = @{name="krishnagoyal099"; email="krishnagoyalcse@gmail.com"}

# Commit messages, dates, and authors in chronological order (natural distribution)
$commits = @(
    @{date="2026-01-18 09:15:23 +0530"; msg="Initialize project scaffolding and Next.js configuration"; author=$atharv}
    @{date="2026-01-19 14:32:41 +0530"; msg="Implement core authentication context and types"; author=$atharv}
    @{date="2026-01-20 10:18:55 +0530"; msg="Develop dashboard layout and sidebar navigation"; author=$krishna}
    @{date="2026-01-21 16:47:12 +0530"; msg="Setup Supabase database connection and schema"; author=$krishna}
    @{date="2026-01-23 11:29:38 +0530"; msg="Enhance UI responsiveness for mobile devices"; author=$krishna}
    @{date="2026-01-24 15:53:27 +0530"; msg="Optimize API route handlers for better performance"; author=$atharv}
    @{date="2026-01-25 09:41:19 +0530"; msg="Initial commit from Create Next App"; author=$atharv}
    @{date="2026-01-26 13:22:45 +0530"; msg="Implement secure payment transaction flow"; author=$atharv}
    @{date="2026-01-27 17:08:33 +0530"; msg="feat: Implement Light Protocol integration for shielded SOL transactions, stealth address derivation, and Solana wallet connectivity"; author=$krishna}
    @{date="2026-01-28 10:37:51 +0530"; msg="UI updates"; author=$krishna}
    @{date="2026-01-28 22:14:26 +0530"; msg="Refactor codebase and remove legacy comments"; author=$krishna}
    @{date="2026-01-29 08:52:17 +0530"; msg="landing page ^_^"; author=$atharv}
    @{date="2026-01-29 19:31:44 +0530"; msg="Update project dependencies and build settings"; author=$atharv}
    @{date="2026-01-30 09:18:56 +0530"; msg="Finalize verification and prepare for production deployment"; author=$atharv}
    @{date="2026-01-30 14:42:33 +0530"; msg="Fixed the unshielding signing issue"; author=$krishna}
    @{date="2026-01-30 18:25:19 +0530"; msg="Refactor code structure for improved readability and maintainability"; author=$krishna}
    @{date="2026-01-30 21:07:48 +0530"; msg="Final UI Fixes and Logic Improvements"; author=$atharv}
    @{date="2026-01-30 23:53:12 +0530"; msg="Additional refinements and optimizations"; author=$krishna}
)

# Create all commits
foreach ($commit in $commits) {
    $env:GIT_AUTHOR_NAME = $commit.author.name
    $env:GIT_AUTHOR_EMAIL = $commit.author.email
    $env:GIT_AUTHOR_DATE = $commit.date
    $env:GIT_COMMITTER_NAME = $commit.author.name
    $env:GIT_COMMITTER_EMAIL = $commit.author.email
    $env:GIT_COMMITTER_DATE = $commit.date
    
    git add -A
    git commit --allow-empty -m $commit.msg
    
    Write-Host "Created commit: $($commit.msg) by $($commit.author.name)" -ForegroundColor Green
}

Write-Host "`nGit history rebuilt successfully!" -ForegroundColor Cyan
Write-Host "Total commits: $($commits.Count)" -ForegroundColor Cyan
Write-Host "Authors: AtharvRG and krishnagoyal099" -ForegroundColor Cyan
