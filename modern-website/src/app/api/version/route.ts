import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const packageJson = JSON.parse(
      readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
    );
    
    return NextResponse.json({
      version: packageJson.version || '1.0.0',
      buildTime: new Date().toISOString(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
    });
  } catch (error) {
    return NextResponse.json({ 
      version: '1.0.0', 
      buildTime: new Date().toISOString(),
      commit: 'unknown'
    });
  }
}
