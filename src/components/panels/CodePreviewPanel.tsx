import Editor from '@monaco-editor/react';
import { useAppSelector } from '../../store/hooks';

export default function CodePreviewPanel() {
  const code = useAppSelector((s) => s.workspace.generatedCode);

  return (
    <div className="flex flex-col h-full border-t border-gray-200 bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-3 py-1 bg-[#252526] border-b border-[#3c3c3c]">
        <span className="text-xs text-gray-400 font-medium">MicroPython Output</span>
        <span className="text-xs text-gray-500">ESP32</span>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language="python"
          value={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            renderLineHighlight: 'none',
            padding: { top: 8 },
          }}
        />
      </div>
    </div>
  );
}
