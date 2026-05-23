import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: "Didn't receive any code"}, {status: 400});
    }

    // Design the prompt for AI

    return NextResponse.json({
      success: true,
      message: "AIchannel testing successful",
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Server internally error"}, {status: 500});
  }
}