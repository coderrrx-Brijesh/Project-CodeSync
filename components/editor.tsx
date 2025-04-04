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

// Load additional languages (these will be loaded dynamically)
const loadAdditionalLanguages = () => {
  // This is just a check function - Monaco will load languages as needed
  return true;
};

// This function configures Monaco with proper settings
const configureMonaco = (monacoInstance: typeof monaco) => {
  // Define custom language display names for better UI
  const languageDisplayNames: { [key: string]: string } = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    less: "Less",
    json: "JSON",
    markdown: "Markdown",
    python: "Python",
    java: "Java",
    cpp: "C++",
    csharp: "C#",
    php: "PHP",
    ruby: "Ruby",
    rust: "Rust",
    go: "Go",
    swift: "Swift",
    kotlin: "Kotlin",
    scala: "Scala",
    shell: "Shell/Bash",
    sql: "SQL",
    yaml: "YAML",
    xml: "XML",
    plaintext: "Plain Text",
  };

  // Set custom options for each language if needed
  // This is just an example, you can expand as needed
  const languageConfigurations: { [key: string]: any } = {
    javascript: {
      wordBasedSuggestions: true,
      suggestOnTriggerCharacters: true,
    },
    typescript: {
      wordBasedSuggestions: true,
      suggestOnTriggerCharacters: true,
    },
    python: {
      wordBasedSuggestions: true,
      suggestOnTriggerCharacters: true,
    },
  };

  // Apply language configurations
  Object.keys(languageConfigurations).forEach((lang) => {
    if (monacoInstance.languages.getLanguages().some((l) => l.id === lang)) {
      monacoInstance.languages.setLanguageConfiguration(
        lang,
        languageConfigurations[lang]
      );
    }
  });

  return { languageDisplayNames };
};

interface EditorProps {
  language: string;
  initialContent: string;
  onCodeChange?: (value: string) => void;
  fileId?: string;
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
  const [languageMap, setLanguageMap] = useState<{ [key: string]: string }>({});
  const lastReceivedContent = useRef<string>(initialContent);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Configure Monaco when it's ready
  useEffect(() => {
    if (monaco) {
      const { languageDisplayNames } = configureMonaco(monaco);
      setLanguageMap(languageDisplayNames);
      loadAdditionalLanguages();
    }
  }, []);

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
  }, [isEditorReady, language, languageMap]);

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
              enabled: !isMobile, // Disable minimap on mobile
              size: "proportional",
              showSlider: "mouseover",
            },
            tabSize: 2,
            formatOnType: true,
            formatOnPaste: true,
            wordWrap: "on",
            lineNumbers: isMobile ? "off" : "on", // Simpler UI on mobile
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: isMobile ? false : "active", // Simpler UI on mobile
              indentation: !isMobile,
            },
            hover: { delay: 200 },
            renderLineHighlight: "all",
            suggest: {
              preview: !isMobile,
              showWords: true,
              showStatusBar: !isMobile,
            },
            padding: { top: 10 },
            fontLigatures: !isMobile, // Disable font ligatures on mobile for better performance
            fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
            fontSize: isMobile ? 13 : 14, // Slightly smaller font on mobile
            lineHeight: 1.5,
            fixedOverflowWidgets: true, // Fix for suggestions popup on mobile
            overviewRulerBorder: false, // Cleaner UI
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: isMobile ? 12 : 10, // Larger scrollbar for touch
              horizontalScrollbarSize: isMobile ? 12 : 10,
            },
            parameterHints: {
              enabled: !isMobile, // Disable parameter hints on mobile
            },
          }}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      </div>

      {/* Status bar - simplified on mobile */}
      <div className="h-6 bg-black/40 border-t border-white/10 text-xs text-muted-foreground flex items-center px-2 justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Code2 className="h-3 w-3" />
            <span>{languageInfo}</span>
          </div>
          {!isMobile && (
            <div className="flex items-center space-x-1">
              <Info className="h-3 w-3" />
              <span>{lineCount} lines</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {!isMobile && (
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span>Synced</span>
            </div>
          )}
          <div>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </div>
        </div>
      </div>
    </div>
  );
}
