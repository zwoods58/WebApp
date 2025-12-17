# Video Setup Instructions

## Trimming Videos to Half Duration

To trim the videos (`flourist.mp4`, `model.mp4`, `cooking.mp4`) to half their duration:

### Option 1: Using the Script (Requires FFmpeg)

1. **Install FFmpeg** (if not already installed):
   - **Windows**: Download from [https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/)
     - Extract and add to PATH, or place `ffmpeg.exe` in a folder that's in your PATH
   - **Mac**: `brew install ffmpeg`
   - **Linux**: `sudo apt-get install ffmpeg`

2. **Run the trim script**:
   ```bash
   npm run trim-videos
   ```

   This will trim the original videos to half their duration and create backups with "-backup" suffix.
   The script automatically overwrites the original files with trimmed versions.

### Option 2: Manual Trimming with FFmpeg

If you prefer to trim manually, use these commands:

```bash
# Get video duration first
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public/flourist.mp4

# Trim to half duration (replace DURATION with half the actual duration)
ffmpeg -i public/flourist.mp4 -t DURATION -c copy public/flourist-trimmed.mp4
ffmpeg -i public/model.mp4 -t DURATION -c copy public/model-trimmed.mp4
ffmpeg -i public/cooking.mp4 -t DURATION -c copy public/cooking-trimmed.mp4
```

### Option 3: Online Tools

You can also use online video editors like:
- [CloudConvert](https://cloudconvert.com/mp4-trim)
- [Kapwing](https://www.kapwing.com/tools/trim-video)
- [Clideo](https://clideo.com/cut-video)

---

## Current Implementation

The Hero component features:
- **Video Rotation**: Three videos rotate automatically one at a time (flourist → model → cooking → repeat)
- **Smooth Transitions**: 2-second crossfade transitions between videos
- **Integrated Header**: Header is blended into the hero banner with transparent background at the top
- **Continuous Loop**: Videos automatically loop back to the beginning after the last video
- **No Overlays**: Videos display cleanly without shaders or overlays

The videos are expected to be in the `public/` folder:
- `/flourist.mp4`
- `/model.mp4`
- `/cooking.mp4`

After running the trim script, these files will be automatically updated to half duration.

