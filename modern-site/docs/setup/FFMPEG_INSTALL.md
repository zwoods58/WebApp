# Installing FFmpeg on Windows

## Quick Installation Guide

### Option 1: Using Chocolatey (Recommended - Easiest)

If you have Chocolatey installed:
```powershell
choco install ffmpeg
```

### Option 2: Manual Installation

1. **Download FFmpeg:**
   - Go to: https://www.gyan.dev/ffmpeg/builds/
   - Download the "ffmpeg-release-essentials.zip" file
   - Or use direct link: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip

2. **Extract and Install:**
   - Extract the zip file to a location like `C:\ffmpeg`
   - Open PowerShell as Administrator
   - Run: `[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\ffmpeg\bin", "User")`
   - Close and reopen your terminal

3. **Verify Installation:**
   ```powershell
   ffmpeg -version
   ```

### Option 3: Using Scoop

If you have Scoop installed:
```powershell
scoop install ffmpeg
```

### Option 4: Portable Version (No Installation Required)

1. Download FFmpeg from: https://www.gyan.dev/ffmpeg/builds/
2. Extract to a folder (e.g., `C:\ffmpeg`)
3. Run the script from that folder, or update the script to use the full path to `ffmpeg.exe`

---

## After Installation

Once FFmpeg is installed, run:
```powershell
cd modern-site
npm run trim-videos
```

---

## Alternative: Online Video Editors

If you prefer not to install FFmpeg, you can trim videos using online tools:
- [CloudConvert](https://cloudconvert.com/mp4-trim)
- [Kapwing](https://www.kapwing.com/tools/trim-video)
- [Clideo](https://clideo.com/cut-video)

Just trim each video to half its duration manually.

