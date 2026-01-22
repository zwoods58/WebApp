// Audio Processing Utilities
// Handles audio compression, conversion, and optimization for low bandwidth

/**
 * Convert audio blob to base64 string
 * @param {Blob} blob - Audio blob
 * @returns {Promise<string>} Base64 encoded audio
 */
export async function audioToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Compress audio blob for low bandwidth transmission
 * @param {Blob} audioBlob - Original audio blob
 * @returns {Promise<Blob>} Compressed audio blob
 */
export async function compressAudio(audioBlob) {
  try {
    // If blob is already small enough, return as is
    if (audioBlob.size < 100000) { // 100KB
      return audioBlob;
    }

    // Create audio context for processing
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Convert blob to array buffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    
    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Downsample to mono and lower sample rate for smaller size
    const offlineContext = new OfflineAudioContext(
      1, // mono
      audioBuffer.duration * 16000, // 16kHz sample rate
      16000
    );
    
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);
    
    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert back to blob
    const compressedBlob = await audioBufferToBlob(renderedBuffer);
    
    console.log(`Audio compressed: ${audioBlob.size} → ${compressedBlob.size} bytes`);
    
    return compressedBlob;
  } catch (error) {
    console.warn('Audio compression failed, using original:', error);
    return audioBlob;
  }
}

/**
 * Convert AudioBuffer to Blob
 * @param {AudioBuffer} audioBuffer - Audio buffer
 * @returns {Promise<Blob>} Audio blob
 */
async function audioBufferToBlob(audioBuffer) {
  return new Promise((resolve) => {
    // Convert to WAV format
    const wav = audioBufferToWav(audioBuffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    resolve(blob);
  });
}

/**
 * Convert AudioBuffer to WAV format
 * @param {AudioBuffer} audioBuffer - Audio buffer
 * @returns {ArrayBuffer} WAV file data
 */
function audioBufferToWav(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const data = audioBuffer.getChannelData(0);
  const dataLength = data.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write audio data
  floatTo16BitPCM(view, 44, data);

  return buffer;
}

/**
 * Write string to DataView
 */
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Convert float audio data to 16-bit PCM
 */
function floatTo16BitPCM(view, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

/**
 * Get audio duration from blob
 * @param {Blob} audioBlob - Audio blob
 * @returns {Promise<number>} Duration in seconds
 */
export async function getAudioDuration(audioBlob) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.duration;
  } catch (error) {
    console.error('Error getting audio duration:', error);
    return 0;
  }
}

/**
 * Check if audio is silent or too quiet
 * @param {Blob} audioBlob - Audio blob
 * @returns {Promise<boolean>} True if audio is too quiet
 */
export async function isAudioTooQuiet(audioBlob) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const data = audioBuffer.getChannelData(0);
    
    // Calculate RMS (root mean square) to measure volume
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    const rms = Math.sqrt(sum / data.length);
    
    // Threshold for "too quiet" (adjust as needed)
    const QUIET_THRESHOLD = 0.01;
    
    return rms < QUIET_THRESHOLD;
  } catch (error) {
    console.error('Error checking audio volume:', error);
    return false;
  }
}

/**
 * Validate audio file
 * @param {Blob} audioBlob - Audio blob
 * @returns {Promise<Object>} Validation result
 */
export async function validateAudio(audioBlob) {
  const result = {
    valid: true,
    errors: [],
  };

  // Check size
  if (audioBlob.size < 1000) {
    result.valid = false;
    result.errors.push('Audio file too small');
  }

  if (audioBlob.size > 10000000) { // 10MB
    result.valid = false;
    result.errors.push('Audio file too large');
  }

  // Check duration
  const duration = await getAudioDuration(audioBlob);
  if (duration < 0.5) {
    result.valid = false;
    result.errors.push('Audio too short');
  }

  if (duration > 15) {
    result.valid = false;
    result.errors.push('Audio too long');
  }

  // Check if too quiet
  const tooQuiet = await isAudioTooQuiet(audioBlob);
  if (tooQuiet) {
    result.valid = false;
    result.errors.push('Audio too quiet');
  }

  return result;
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


