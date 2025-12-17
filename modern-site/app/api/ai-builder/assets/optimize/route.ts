/**
 * Image Optimization API Route
 * P1 Feature 12: Enhanced Asset Management
 */

import { NextRequest, NextResponse } from 'next/server'
import { optimizeImage, generateThumbnail, getImageDimensions } from '../../../../ai_builder/lib/assets/image-optimizer'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined
    const quality = formData.get('quality') ? parseInt(formData.get('quality') as string) : 80
    const format = (formData.get('format') as 'webp' | 'avif' | 'jpeg' | 'png') || 'webp'
    const generateThumb = formData.get('thumbnail') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'File required' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Get original dimensions
    const dimensions = await getImageDimensions(buffer)

    // Optimize image
    const optimizedBuffer = await optimizeImage(buffer, {
      width,
      height,
      quality,
      format
    })

    // Generate thumbnail if requested
    let thumbnailBuffer: Buffer | null = null
    if (generateThumb) {
      thumbnailBuffer = await generateThumbnail(buffer, 200)
    }

    // Convert to base64 for response
    const optimizedBase64 = optimizedBuffer.toString('base64')
    const thumbnailBase64 = thumbnailBuffer?.toString('base64')

    return NextResponse.json({
      success: true,
      optimized: {
        data: `data:image/${format};base64,${optimizedBase64}`,
        width: width || dimensions.width,
        height: height || dimensions.height,
        size: optimizedBuffer.length,
        format
      },
      thumbnail: thumbnailBase64
        ? {
            data: `data:image/webp;base64,${thumbnailBase64}`,
            size: thumbnailBuffer.length
          }
        : null,
      original: {
        width: dimensions.width,
        height: dimensions.height,
        size: buffer.length
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Image optimization failed' },
      { status: 500 }
    )
  }
}





