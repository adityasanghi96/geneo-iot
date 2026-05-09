import { useRef, useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearConsole } from '../../store/slices/uiSlice';
import { connectionManager } from '../../connection/ConnectionManager';

export default function ConsolePanel() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector((s) => s.ui.consoleOutput);
  const connected = useAppSelector((s) => s.device.connected);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [replInput, setReplInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const sendRepl = () => {
    const line = replInput.trim();
    if (!line) return;
    connectionManager.write(line + '\r\n');
    setHistory((h) => [line, ...h].slice(0, 50));
    setHistoryIdx(-1);
    setReplInput('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { sendRepl(); return; }
    if (e.key === 'ArrowUp') {
      const idx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(idx);
      setReplInput(history[idx] ?? '');
    }
    if (e.key === 'ArrowDown') {
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setReplInput(idx === -1 ? '' : history[idx]);
    }
    // Ctrl+C → send interrupt
    if (e.key === 'c' && e.ctrlKey) {
      connectionManager.write('\x03');
    }
    // Ctrl+D → soft reset
    if (e.key === 'd' && e.ctrlKey) {
      connectionManager.write('\x04');
    }
  };

  const colorMap = {
    output: 'text-gray-200',
    error: 'text-red-400',
    info: 'text-blue-400',
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Console</span>
          {connected && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400">REPL</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {connected && (
            <span className="text-[10px] text-gray-600">
              ↑↓ history · Ctrl+C interrupt · Ctrl+D reset
            </span>
          )}
          <button
            onClick={() => dispatch(clearConsole())}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {entries.map((entry) => (
          <div key={entry.id} className={`text-xs ${colorMap[entry.type]} leading-5`}>
            <span className="text-gray-600 mr-2 text-[10px]">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <span className="whitespace-pre-wrap">{entry.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* REPL input */}
      <div className="flex items-center px-3 py-1.5 border-t border-[#3c3c3c] bg-[#252526] shrink-0">
        <span className="text-gray-500 text-xs mr-2 select-none">&gt;&gt;&gt;</span>
        <input
          value={replInput}
          onChange={(e) => setReplInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!connected}
          className="flex-1 bg-transparent text-xs text-gray-200 outline-none placeholder-gray-600 disabled:opacity-40"
          placeholder={connected ? 'Type Python and press Enter…' : 'Connect a device to use REPL…'}
          autoComplete="off"
          spellCheck={false}
        />
        {connected && replInput && (
          <button
            onClick={sendRepl}
            className="ml-2 text-[10px] text-blue-400 hover:text-blue-300"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
