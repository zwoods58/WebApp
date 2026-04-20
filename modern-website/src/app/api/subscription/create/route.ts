import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await fetch(
      process.env.NEXT_PUBLIC_SUPABASE_URL + "/functions/v1/create-subscription",
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        },
        body: JSON.stringify(body)
      }
    );

    const responseData = await response.json();
    
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" }, 
      { status: 500 }
    );
  }
}

