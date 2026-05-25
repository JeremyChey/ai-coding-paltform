"use client";

import {useRef, useState } from 'react'; // import useRef and useState
import Editor from '@monaco-editor/react';

export default function CodingPage() {
  // Create a place with null value
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  // Create a space to put the result
  const [consoleOutput, setConsoleOutput] = useState<string>("");

  // Create tabs of terminal and ai
  const [activeTab, setActiveTab] = useState<"terminal" | "ai">("terminal");
  
  // Create a space to store AI feedback
  const [aiFeedback, setAiFeedback] = useState<string>("");
  
  // Function of Hover when indicating the error part
//const [hoveredError, setHoveredError] = useState<{ text: string; x:number; y:number} | null>(null);
  
  function handleEditorDidMount(editor: any, monaco:any) {
    editorRef.current = editor; // Store the true value in mount point
    monacoRef.current = monaco;

    if (monaco.languages.json) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: false,
    });
  }

    {/*Listen for mouse movement over the editor
    editor.onMouseMove((e:any) => {
      const position = e.target?.position;
      if(!position){setHoveredError(null); return;}
      
      const model = editor.getModel();
      if (!model) { setHoveredError(null); return; }

    // Get all markers at the current cursor position
    const markers = monaco.editor.getModelMarkers({ resource: model.uri });
    const hit = markers.find(
      (m: any) =>
        position.lineNumber >= m.startLineNumber &&
        position.lineNumber <= m.endLineNumber &&
        position.column >= m.startColumn &&
        position.column <= m.endColumn
    );

    if (hit) {
      const domNode = editor.getDomNode();
      const rect = domNode?.getBoundingClientRect();
      const mouseX = e.event.browserEvent.clientX - rect.left;
      const mouseY = e.event.browserEvent.clientY - rect.top;

      setHoveredError({
        text: hit.message,
        x: mouseX + 10,
        y: mouseY + 10,
      });
    } else {
      setHoveredError(null);
    }
  });

  // Clear tooltip when mouse leaves editor
  editor.onMouseLeave(() => setHoveredError(null)); */}
}
    

  // Function of when clicking on "Ask Mentor"
  async function handleAskAI(){
    if(!editorRef.current || !monacoRef.current) return;

    //Get the newest code
    const code = editorRef.current.getValue();

    // Switching to AI tab automatically
    setActiveTab("ai");
    setAiFeedback("AI mentor is analyzing your code, please wait.....");
    
    try {
      // Send to backend through AI route
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        setAiFeedback(data.preparedPrompt);

        // Get the latest editor model
        const editor = editorRef.current;
      //const model = editor.getModel();
        const monaco = monacoRef.current;

        if (editor && monaco) {
          const currentModel = editor.getModel();

          if (currentModel) {
            const markers= [
              {
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: 30,
                message: "AI Mentor Tip: Double check this line for any syntax standard!",
              }
            ];

        // Using monaco to add red lines
        monaco.editor.setModelMarkers(currentModel, "ai-mentor", markers);
        console.log("Markers applied precisely to current view:", currentModel.uri.toString());
       }
     }
   }

       else {
        setAiFeedback(`Error: ${data.error}`);
      }

    } catch (error) {
      setAiFeedback("Network error, please check whether backend has been activated properly.");
    }
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
          <h2 className="text-2xl font-bold text-white">Question 1: Hello world</h2>
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

        {/* Wrapper: relative anchor for tooltip */}
     { /*<div className="relative flex-shrink-0">*/}

         {/* frame box for inputting code*/}
          <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              defaultValue={`print()`}
              onMount={handleEditorDidMount} // Tie the mount, get the ture value
              options={{
                fontSize: 16,
                minimap:{enabled: false}, //Close the right minimap to have spacious look
                automaticLayout: true, //Automatically adjust the box size
                hover: { enabled:true },
                glyphMargin: true,
              }}
            />
          </div>

          {/*Hover*/}
       { /*{hoveredError && (
            <div
              style={{ top: hoveredError.y, left: hoveredError.x }}
              className="absolute bg-gray-800 border border-red-500 text-red-200 text-xs rounded p-2 shadow-xl z-50 pointer-events-none max-w-xs"
            >
              ⚠️ {hoveredError.text}
            </div>
          )}
        </div>*/}

          {/*Terminal + AI mentor Tabs*/}
          <div className="h-48 w-full bg-gray-950 rounded-lg border border-gray-800 flex flex-col overflow-hidden flex-shrink-0">
          
            {/* Tabs Headers*/}
            <div className="bg-gray-900 border-b border-gray-800 flex items-center justify-between px-2 flex-shrink-0">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("terminal")}
                  className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colours ${
                    activeTab === "terminal"
                      ? "border-green-500 text-green-400 bg-gray-950"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  📟Terminal Output
                </button>
                <button
                    onClick={() => setActiveTab("ai")}
                    className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                      activeTab === "ai"
                        ? "border-green-500 text-green-400 bg-gray-950"
                        : "border-transparent text-gray-500 hover:text-gray-300"
                    }`}
                  >
                  🤖 AI Mentor
              </button>
            </div>

            {/*Clear button*/}
            {((activeTab === "terminal" && consoleOutput) || (activeTab === "ai" && aiFeedback)) && (
              <button 
                onClick={() => activeTab === "terminal" ? setConsoleOutput("") : setAiFeedback("")} 
                className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Content Showcase*/}
          <div className="p-4 flex-1 overflow-y-auto font-mono text-sm">
            {activeTab === "terminal" ? (
              <pre className="text-green-400 whitespace-pre-wrap">
                {consoleOutput || "Waiting while running code....."}
              </pre>
            ) : (
              <pre className="text-blue-400 whitespace-pre-wrap">
                {aiFeedback || "Click \"Ask Mentor\" button to get professional and useful suggestions....."}
              </pre>
            )
         }
         </div>
       </div>

          {/*button*/}
          <div className="flex justify-end gap-3">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-lg transition-colors">
              Restart
            </button>

            {/*"Ask Mentor" button*/}
            <button
              onClick={handleAskAI}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md shadow-blue-900/20 transition-colors">
              Ask Mentor
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
