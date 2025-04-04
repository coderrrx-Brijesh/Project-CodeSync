"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as monaco from "monaco-editor";
import { socketManager } from "@/lib/socket";
import { Info, Code2, CheckCircle2 } from "lucide-react";

const socket = socketManager.connect();

// Dynamically import Monaco Editor with no SSR
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface EditorProps {
  language: string;
  initialContent: string;
  onCodeChange?: (value: string) => void;
  fileId?: string; // Use fileId instead of key to track which file is being edited
}

export function Editor({
  language,
  initialContent = "",
  onCodeChange,
  fileId,
}: EditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [languageInfo, setLanguageInfo] = useState("");
  const [lineCount, setLineCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const lastReceivedContent = useRef<string>(initialContent);

  // Configure editor theme
  useEffect(() => {
    if (isEditorReady && monaco) {
      // Define a custom theme that's more professional
      monaco.editor.defineTheme("professional-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "keyword", foreground: "C586C0", fontStyle: "bold" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "type", foreground: "4EC9B0" },
        ],
        colors: {
          "editor.background": "#1E1E1E",
          "editor.foreground": "#D4D4D4",
          "editorCursor.foreground": "#AEAFAD",
          "editor.lineHighlightBackground": "#2D2D2D",
          "editorLineNumber.foreground": "#858585",
          "editor.selectionBackground": "#264F78",
          "editor.selectionHighlightBackground": "#2D2D2D",
          "editorIndentGuide.background": "#404040",
          "editorIndentGuide.activeBackground": "#707070",
        },
      });

      // Apply the theme
      monaco.editor.setTheme("professional-dark");
      setEditorTheme("professional-dark");
    }
  }, [isEditorReady]);

  // Set initial content when editor is mounted or when initialContent changes
  useEffect(() => {
    if (isEditorReady && editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== initialContent) {
        editorRef.current.setValue(initialContent);
      }
    }
  }, [initialContent, isEditorReady]);

  // Handle socket events for collaborative editing
  useEffect(() => {
    const handleCodeChanged = ({ code }: { code: string }) => {
      if (editorRef.current && code && code !== lastReceivedContent.current) {
        lastReceivedContent.current = code;

        // Only update if the content is different to avoid loops
        const currentValue = editorRef.current.getValue();
        if (currentValue !== code) {
          // Save cursor position
          const position = editorRef.current.getPosition();

          editorRef.current.setValue(code);

          // Restore cursor position
          if (position) {
            editorRef.current.setPosition(position);
            editorRef.current.revealPositionInCenter(position);
          }
        }
      }
    };

    socket.on("code-changed[SERVER]", handleCodeChanged);

    return () => {
      socket.off("code-changed[SERVER]", handleCodeChanged);
    };
  }, []);

  // Add an effect to listen for file updates
  useEffect(() => {
    const socket = socketManager.connect();

    socket.on("file-updated", ({ fileId: updatedFileId, content }) => {
      // Only update the editor if the current file is being updated
      if (fileId === updatedFileId) {
        // Update the editor content
        // This might require using a ref to the Monaco editor instance
        // or using another approach depending on how the editor is implemented
      }
    });

    return () => {
      socket.off("file-updated");
    };
  }, [fileId]);

  // Update line count and language info
  useEffect(() => {
    if (isEditorReady && editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        // Get line count from model
        setLineCount(model.getLineCount());

        // Set language display name
        const languageMap: { [key: string]: string } = {
          javascript: "JavaScript",
          typescript: "TypeScript",
          html: "HTML",
          css: "CSS",
          json: "JSON",
          markdown: "Markdown",
          python: "Python",
          java: "Java",
          cpp: "C++",
          csharp: "C#",
          go: "Go",
          rust: "Rust",
          php: "PHP",
          ruby: "Ruby",
          swift: "Swift",
          kotlin: "Kotlin",
          plaintext: "Plain Text",
        };
        setLanguageInfo(languageMap[language] || language);
      }

      // Add cursor position change listener
      const disposable = editorRef.current.onDidChangeCursorPosition((e) => {
        setCursorPosition({
          line: e.position.lineNumber,
          column: e.position.column,
        });
      });

      return () => {
        disposable.dispose();
      };
    }
  }, [isEditorReady, language]);

  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      lastReceivedContent.current = value;
      onCodeChange?.(value);
      socketManager.changeCode(value);

      // Update line count when content changes
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          setLineCount(model.getLineCount());
        }
      }
    }
  };

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Set initial content
    if (initialContent) {
      editor.setValue(initialContent);
    }

    // Initial line count
    const model = editor.getModel();
    if (model) {
      setLineCount(model.getLineCount());
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="flex-1 relative">
        <MonacoEditor
          height="100%"
          width="100%"
          language={language}
          theme={editorTheme}
          options={{
            automaticLayout: true,
            minimap: {
              enabled: true,
              size: "proportional",
              showSlider: "mouseover",
            },
            tabSize: 2,
            formatOnType: true,
            formatOnPaste: true,
            wordWrap: "on",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: "active",
              indentation: true,
            },
            hover: { delay: 200 },
            renderLineHighlight: "all",
            suggest: {
              preview: true,
              showWords: true,
              showStatusBar: true,
            },
            padding: { top: 10 },
            fontLigatures: true,
            fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
            fontSize: 14,
            lineHeight: 1.5,
          }}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      </div>

      {/* Status bar */}
      <div className="h-6 bg-black/40 border-t border-white/10 text-xs text-muted-foreground flex items-center px-2 justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Code2 className="h-3 w-3" />
            <span>{languageInfo}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Info className="h-3 w-3" />
            <span>{lineCount} lines</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span>Synced</span>
          </div>
          <div>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </div>
        </div>
      </div>
    </div>
  );
}
