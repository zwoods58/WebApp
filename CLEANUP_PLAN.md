# Project Cleanup Plan

## Files/Folders to Remove

### Root Level (Old Website Structure)
- [ ] `/src/` - Old website source code
- [ ] `/public/` - Old public assets (except what's needed)
- [ ] `/data/` - Old JSON data files  
- [ ] `/scripts/` - Old automation scripts (not used in modern-site)
- [ ] `/tests/` - Old test files
- [ ] `/squarespace-ui/` - Unused folder
- [ ] `/docs/` - Old documentation (duplicate of modern-site/docs)
- [ ] `/.env.local` - Old website env file
- [ ] `/.env` - Old env file
- [ ] `/package.json` - Old package file
- [ ] `/package-lock.json` - Old lock file  
- [ ] `/next.config.js` - Old config
- [ ] `/tsconfig.json` - Old typescript config
- [ ] `/tailwind.config.js` - Old tailwind config
- [ ] `/postcss.config.js` - Old postcss config
- [ ] `/next-env.d.ts` - Old Next.js types
- [ ] `/tsconfig.tsbuildinfo` - Build artifact
- [ ] `/vercel.json` - Old vercel config
- [ ] `/components.json` - Duplicate
- [ ] `/PROJECT_STRUCTURE.md` - Outdated

###Root Level Documentation to Remove
- [ ] `/LOADING_SCREEN_IDEAS.md`

### Files to Keep in Root
- `modern-site/` - **MAIN PROJECT**
- `env.example` - Template for environment variables
- `README.md` - May need updating to point to modern-site

## Environment Files Status
- **Root `.env.local`**: Old Supabase (paqhkcdqrbhyfsntcdnz) - ❌ DELETE
- **Modern-site `.env.local`**: Current Supabase (hlsodrowyhhxvnqvuvpz) + Claude + Flutterwave - ✅ KEEP

## Post-Cleanup Actions
1. Update root README to reflect modern-site as main project
2. Verify modern-site builds successfully
3. Update any documentation references


