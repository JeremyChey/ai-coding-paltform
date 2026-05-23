"use client";

import {useRef, useState } from 'react'; // import useRef and useState
import Editor from '@monaco-editor/react';

export default function CodingPage() {
  // Create a place with null value
  const editorRef = useRef<any>(null);

  // Create a space to put the result
  const [consoleOutput, setConsoleOutput] = useState<string>("");

  function handleEditorDidMount(editor: any) { // When editor fully loaded, manaco will transfer the true value to us
    editorRef.current = editor; // Store the true value in mount point
  }

  // Function of when clicking on "Running Code"
  async function handleRunCode() {
    // If editor hasn't done, return
    if (!editorRef.current) return;

    // Extract all the input from mount point
    const code = editorRef.current.getValue();

    // Backend API which sent POST request
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), 
      });

      const data = await response.json();
      if (data.success){
        setConsoleOutput(data.output);
      } else {
        setConsoleOutput(`Error: ${data.error}`);
      }
    
    } catch (error) {
      setConsoleOutput("Network error, please check whether backend has been activated properly.");
    }
  }
  return (
    // black background of webapage
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      
      {/* Top bar */}
      <header className="border-b border-gray-800 p-4 bg-gray-900/50 backdrop-blur">
        <h1 className="text-xl font-bold text-green-400 flex items-center gap-2">
          <span>🤖</span> AI Coding Platform
        </h1>
      </header>
      
      {/*main content: two boxes at both left and right sides*/}
      <main className="flex-1 flex flex-row p-4 gap-4 overflow-hidden">

        {/*left box: question*/}
        <div className="w-1/2 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex-col gap-4">
          <h2 className="text-2xl font bold text white">Question 1: Hello world</h2>
          <p className="text-gray-400">
              Using Python, print out<code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">Hello world</code>.
          </p>
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 mt-2">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">📥 Expected output:</h3>
            <pre className="font-mono text-green-400">Hello World</pre>
            </div>
         </div>
  
      {/*right box:user writing code*/}
        <div className="w-1/2 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-medium">📄 index.py</span>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Python</span>
          </div>

         {/* frame box for inputting code*/}
         <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
          <Editor
            height="100%"
            language="python"
            theme="vs-dark"
            defaultValue={`print("Hello World")`}
            onMount={handleEditorDidMount} // Tie the mount, get the ture value
            options={{
              fontSize: 16,
              minimap:{ enabled: false}, //Close the right minimap to have spacious look
              automaticLayout: true, //Automatically adjust the box size
            }}
          />
       </div>

          {/* VS similar like terminal*/}
          <div className="h-40 w-full bg-gray-950 rounded-lg p-4 font-mono text-sm border border-gray-800 overflow-y-auto flex-shrink-0">
          <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1 flex justify-between items-center">
            <span>Terminal Output</span>
            {consoleOutput && (
              <button 
                onClick={() => setConsoleOutput("")} 
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <pre className="text-green-400 whitespace-pre-wrap">
            {consoleOutput || "Waiting for running code....."}
          </pre>
        </div>

          {/*button*/}
          <div className="flex justify-end gap-3">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-lg transition-colors">
              Restart
            </button>
            <button
              onClick={handleRunCode} // Tie the clicking event, pack and send the code while clicking on it
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md shadow-green-900/20 transition-colors">
              Running Code
            </button>
          </div>
        </div>

      </main>
    </div>
  );   
}