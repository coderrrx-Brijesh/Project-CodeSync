"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as monaco from "monaco-editor";
import { socketManager } from "@/lib/socket";

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
  const lastReceivedContent = useRef<string>(initialContent);

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

  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      lastReceivedContent.current = value;
      onCodeChange?.(value);
      socketManager.changeCode(value);
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
  };

  return (
    <div className="relative h-full w-full">
      <MonacoEditor
        height="100%"
        width="100%"
        language={language}
        theme="vs-dark"
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          tabSize: 2,
          formatOnType: true,
          formatOnPaste: true,
          wordWrap: "on",
        }}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
