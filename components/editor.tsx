"use client"

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import * as monaco from 'monaco-editor';
import { useEffect } from 'react';

import { socketManager } from '@/lib/socket';

const socket=socketManager.connect();

// Dynamically import Monaco Editor with no SSR
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);
interface EditorProps {
  language: string;
  onCodeChange?: (value: string) => void;
}
export function Editor({ language, onCodeChange }: EditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(()=>{
    socket.on('code-changed[SERVER]', ({code}) => {
      editorRef.current?.setValue(code);
    })
  }, [])
  
  const handleEditorChange = (value?: string) => {
    onCodeChange?.(value || '');
    socketManager.changeCode(value || '');
  };

  return (
    <div className="relative h-full w-full">
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          tabSize: 2,
          formatOnType: true,
          formatOnPaste: true,
          wordWrap: 'on',
        }}
        onChange={handleEditorChange}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
}