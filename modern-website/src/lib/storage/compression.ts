// =====================================================
// UTILITY: Text Compression
// PURPOSE: Compress/decompress text for storage
// =====================================================

// Simple compression using CompressionStream API (modern browsers)
export async function compress(text: string): Promise<Blob> {
  const stream = new Blob([text]).stream();
  const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
  return new Response(compressedStream).blob();
}

export async function decompress(compressed: string | Blob): Promise<string> {
  let blob: Blob;
  
  if (typeof compressed === 'string') {
    blob = new Blob([compressed]);
  } else {
    blob = compressed;
  }
  
  const decompressedStream = blob.stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(decompressedStream).text();
}

// Fallback for environments without CompressionStream
export function compressFallback(text: string): string {
  // Simple fallback: just store as-is
  // In production, consider using lz-string library
  return text;
}

export function decompressFallback(compressed: string): string {
  return compressed;
}

// Auto-detect best method
export const useNativeCompression = typeof CompressionStream !== 'undefined';

