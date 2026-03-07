# Security Vulnerability Resolution Guide

**Status**: 1 Moderate Vulnerability Detected (via Dependabot)  
**Date**: March 6, 2026  
**Action Required**: IMMEDIATE (before marketplace submission)

---

## Quick Diagnosis

The vulnerability is in a transitive dependency (not directly in your `package.json`). GitHub Dependabot identified it when you pushed. 

### To View the Specific Vulnerability:
1. Go to GitHub repository: https://github.com/scottdreinhart/tictactoe
2. Click the **"Security"** tab
3. Click **"Dependabot alerts"**
4. Review the details — it will show:
   - Affected package name
   - Vulnerability ID (CVE-xxxx-xxxxx)
   - Severity: Moderate
   - Recommendation: auto-update or manual patch

---

## Resolution Paths

### Option 1: Let GitHub Auto-Update (Simplest) ✅ RECOMMENDED
If Dependabot provides an auto-fix:
1. Go to Security → Dependabot alerts
2. Click **"Create automated security fix"**
3. GitHub creates a PR with updated lock file
4. Review → Merge PR
5. Pull local changes: `git pull origin main`

### Option 2: Manual Fix via Command Line (Requires WSL/Node)
Once WSL is working again:

```bash
# 1. Check what's vulnerable
pnpm audit

# 2. Fix it automatically
pnpm audit --fix

# 3. Verify fix
pnpm audit

# 4. Commit & push
git add pnpm-lock.yaml
git commit -m "fix: resolve Dependabot security vulnerability"
git push origin main
```

### Option 3: Manual Update Specific Package
If `pnpm audit --fix` doesn't work, identify the package and upgrade it:

```bash
# Example: if it's a Babel package causing issues
pnpm update @babel/core --save-dev

# Or force a specific version
pnpm install <package-name>@latest --save-dev

# Verify
pnpm audit
```

---

## Common Vulnerable Packages in Node Builds

Based on your `package.json`, possible culprits:

| Package | Known Vulnerabilities | Fix |
|---------|---------------------|-----|
| `babel-*` | Transitive deps in Babel 7.29.x | Update to latest 7.x |
| `lodash.merge` | CVE-2023-23940 (prototype pollution) | Update to 4.6.2+ or 5.x |
| `postcss` | CSS injection in older versions | Update to 8.4.31+ |
| `rollup` | Prototype pollution in deps | Update to 4.x+ |

---

## WSL Recovery

Since WSL is stuck, here are your options:

### Option A: Reset WSL (Permanent)
```powershell
# Destroy the entire WSL installation and restart
wsl --unregister Ubuntu

# Reinstall (it will prompt)
wsl --install
```

### Option B: Kill WSL Processes and Retry
```powershell
# Kill all WSL processes
taskkill /IM wsl.exe /F
taskkill /IM wslhost.exe /F

# Shutdown WSL
wsl --shutdown

# Wait 5 seconds
Start-Sleep -Seconds 5

# Try again
wsl bash -c "cd /mnt/c/Users/scott/tictactoe && pnpm audit"
```

### Option C: Use Node from Windows
If you have Node.js installed natively on Windows:
```powershell
# Check if npm/node available
node --version
npm --version

# Then run:
npm audit
npm audit fix
```

---

## Verification Checklist

After applying the fix:

- [ ] Rerun audit: `pnpm audit` shows zero vulnerabilities
- [ ] Build still works: `pnpm build` succeeds
- [ ] Lint passes: `pnpm lint` shows no errors
- [ ] Tests pass (if applicable): `pnpm test`
- [ ] Git status clean: `git status` shows working tree clean
- [ ] Commit pushed: `git log origin/main -1` shows your fix commit

---

## Next Steps After Fix

1. ✅ Resolve Dependabot vulnerability (THIS)
2. ✅ Add Open Graph / Twitter meta tags to `index.html`
3. ✅ Verify PWA installation on mobile
4. ✅ Submit to marketplace

---

## Support

If vulnerability persists after Dependabot auto-fix:
1. Check GitHub Issues for the affected package
2. Upgrade affected package version
3. Contact package maintainers if security fix not released
4. As last resort: switch to alternative package

For security questions: See `COMPLIANCE_AUDIT.md` section 6 (Security Audit)

