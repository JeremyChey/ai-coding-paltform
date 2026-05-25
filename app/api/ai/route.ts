import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: "Didn't receive any code"}, {status: 400});
    }

    // Design the prompt for AI
    const prompt = `
You are an experienced Python mentor. Your mission is to review the Python code submitted by the user and provide guiding feedback.

[Core Principles]
1. NEVER directly provide the corrected or complete code!
2. Use an encouraging and objective tone.
3. Guide the user to discover and fix issues on their own through questions or hints.

[Please analyze and respond using the following structure]
1. 🎯 Overall Evaluation: A one-sentence summary of whether the code achieves the intended functionality.
2. ✨ Highlights: Point out what was done well (e.g., naming conventions, clear logic, efficiency).
3. 🔍 Points for Reflection: If there are bugs or areas for optimization, propose 1-2 inspiring questions to guide the user's thinking (e.g., "Take a look at line 3, what would happen if the input is empty?").

[User's Code to Review]
${code}
`;

    console.log("=== Prepared Prompt for AI ===");
    console.log(prompt);
    console.log("=================================");

    return NextResponse.json({
      success: true,
      message: "AIchannel testing successful",
      preparedPrompt: prompt
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Server internally error"}, {status: 500});
  }
}