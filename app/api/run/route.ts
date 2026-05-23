import { NextResponse } from 'next/server';
import { exec } from 'child_process'; // import child process from node.js
import fs from 'fs';
import path from 'path';

//process the POST request from frontend
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Unpack the JSON data from the request
    const { code } = body; // Get the code from JSON data

    if (!code) {
        return NextResponse.json({success: false, error: "Didn't receive any code"}, {status: 400});
    }
    // Create a temporary Python file in local server
    const tempFileName = `temp_${Date.now()}.py`;
    const tempFilePath = path.join(process.cwd(), tempFileName);

    // Write the code from frontend into this temporary file
    fs.writeFileSync(tempFilePath, code);
    
    // Use local Python to run this file
    const runCommand = `python "${tempFilePath}"`;

    const output = await new Promise<string>((resolve) => {
        exec(runCommand, (error, stdout, stderr) => {
            //Whatever success or fail, delete all the file to clean up server
            if (fs.existsSync(tempFilePath)){
                fs.unlinkSync(tempFilePath);
            }
                resolve(stderr || stdout || "Code has run successfully, but no content is printed.");
         });
     });
    
    // Show the actual result to frontend
    return NextResponse.json({
        success: true,
        message: "The code has been fully run!",
        output: output
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Server internal error"}, {status: 500});
  }
}