#!/usr/bin/env node
/**
 * Script to trim videos to half their duration
 * Requires ffmpeg to be installed: https://ffmpeg.org/download.html
 * 
 * Usage: node scripts/trim-videos.js
 */

import { execSync } from 'child_process'
import { existsSync, unlinkSync, copyFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = join(__dirname, '..', 'public')

const videos = ['flourist.mp4', 'model.mp4', 'cooking.mp4']

function getVideoDuration(videoPath) {
  try {
    const output = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`,
      { encoding: 'utf-8' }
    )
    return parseFloat(output.trim())
  } catch (error) {
    console.error(`Error getting duration for ${videoPath}:`, error.message)
    return null
  }
}

function trimVideo(inputPath, outputPath, duration) {
  const halfDuration = duration / 2
  try {
    execSync(
      `ffmpeg -y -i "${inputPath}" -t ${halfDuration} -c copy "${outputPath}"`,
      { stdio: 'inherit' }
    )
    console.log(`✓ Trimmed ${inputPath} to ${halfDuration.toFixed(2)}s`)
  } catch (error) {
    console.error(`Error trimming ${inputPath}:`, error.message)
    throw error
  }
}

async function main() {
  // Check if ffmpeg is available
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' })
  } catch (error) {
    console.error('❌ ffmpeg is not installed or not in PATH')
    console.log('\nPlease install ffmpeg:')
    console.log('  Windows: https://www.gyan.dev/ffmpeg/builds/')
    console.log('  Mac: brew install ffmpeg')
    console.log('  Linux: sudo apt-get install ffmpeg')
    process.exit(1)
  }

  console.log('🎬 Trimming videos to half duration...\n')

  for (const video of videos) {
    const inputPath = join(publicDir, video)
    const tempPath = join(publicDir, `${video.replace('.mp4', '-temp.mp4')}`)
    const backupPath = join(publicDir, `${video.replace('.mp4', '-backup.mp4')}`)

    if (!existsSync(inputPath)) {
      console.warn(`⚠️  ${video} not found, skipping`)
      continue
    }

    console.log(`Processing ${video}...`)
    const duration = getVideoDuration(inputPath)
    
    if (duration === null) {
      console.warn(`⚠️  Could not get duration for ${video}, skipping`)
      continue
    }

    // Create backup of original
    if (!existsSync(backupPath)) {
      console.log(`Creating backup: ${backupPath}`)
      copyFileSync(inputPath, backupPath)
    }

    // Trim video to temporary file
    trimVideo(inputPath, tempPath, duration)
    
    // Replace original with trimmed version
    if (existsSync(tempPath)) {
      if (existsSync(inputPath)) {
        unlinkSync(inputPath)
      }
      copyFileSync(tempPath, inputPath)
      unlinkSync(tempPath)
      console.log(`✓ Replaced ${video} with trimmed version`)
    }
  }

  console.log('\n✅ All videos trimmed successfully!')
  console.log('   Original videos have been trimmed to half duration')
  console.log('   Backups saved with "-backup" suffix')
}

main().catch(console.error)

