/**
 * Image Optimization Service
 * P1 Feature 12: Enhanced Asset Management - Image Optimization
 */

// Note: Sharp requires server-side execution
// For client-side, use browser APIs or upload to server for processing

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

export interface OptimizedImage {
  url: string
  width: number
  height: number
  size: number
  format: string
}

/**
 * Optimize image (server-side)
 * Requires Sharp library: npm install sharp
 */
export async function optimizeImage(
  imageBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<Buffer> {
  // Dynamic import to avoid bundling in client
  if (typeof window !== 'undefined') {
    throw new Error('Image optimization must run on server')
  }

  try {
    const sharp = await import('sharp')
    
    let pipeline = sharp.default(imageBuffer)

    // Resize if dimensions provided
    if (options.width || options.height) {
      pipeline = pipeline.resize(options.width, options.height, {
        fit: options.fit || 'inside',
        withoutEnlargement: true
      })
    }

    // Convert format
    const format = options.format || 'webp'
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality: options.quality || 80 })
        break
      case 'avif':
        pipeline = pipeline.avif({ quality: options.quality || 80 })
        break
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality: options.quality || 80 })
        break
      case 'png':
        pipeline = pipeline.png({ quality: options.quality || 80 })
        break
    }

    return await pipeline.toBuffer()
  } catch (error: any) {
    throw new Error(`Image optimization failed: ${error.message}`)
  }
}

/**
 * Generate thumbnail
 */
export async function generateThumbnail(
  imageBuffer: Buffer,
  size: number = 200
): Promise<Buffer> {
  return optimizeImage(imageBuffer, {
    width: size,
    height: size,
    format: 'webp',
    fit: 'cover',
    quality: 75
  })
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(imageBuffer: Buffer): Promise<{
  width: number
  height: number
}> {
  if (typeof window !== 'undefined') {
    throw new Error('getImageDimensions must run on server')
  }

  try {
    const sharp = await import('sharp')
    const metadata = await sharp.default(imageBuffer).metadata()
    return {
      width: metadata.width || 0,
      height: metadata.height || 0
    }
  } catch (error: any) {
    throw new Error(`Failed to get image dimensions: ${error.message}`)
  }
}

/**
 * Client-side image optimization using Canvas API
 */
export function optimizeImageClient(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        // Calculate dimensions
        let width = img.width
        let height = img.height

        if (options.width || options.height) {
          const aspectRatio = width / height
          if (options.width && options.height) {
            width = options.width
            height = options.height
          } else if (options.width) {
            width = options.width
            height = width / aspectRatio
          } else {
            height = options.height!
            width = height * aspectRatio
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw image
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to create blob'))
            }
          },
          options.format === 'webp' ? 'image/webp' : 'image/jpeg',
          (options.quality || 80) / 100
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}





