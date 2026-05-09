import { useAppSelector } from '../../store/hooks';

const TEMPLATE_FILES = ['main.py', 'ssd1306.py'];
const WORKSPACE_FILES = ['workspace.geneo.xml'];

export default function FilesPanel() {
  const connected = useAppSelector((s) => s.device.connected);
  const deviceName = useAppSelector((s) => s.device.deviceName);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-3 py-1 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
        <span className="text-xs text-gray-400 font-medium">File Manager</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* On Device */}
        <div className="px-3 pt-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            On Device {connected && <span className="text-green-400">— {deviceName}</span>}
          </p>
          {connected ? (
            <p className="text-xs text-gray-500 italic">No files found</p>
          ) : (
            <p className="text-xs text-gray-600 italic">Connect a device to browse files</p>
          )}
        </div>

        {/* Workspace / Templates */}
        <div className="px-3 pt-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            Templates
          </p>
          {TEMPLATE_FILES.map((f) => (
            <FileRow key={f} name={f} />
          ))}
        </div>

        <div className="px-3 pt-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            Blocks to Code
          </p>
          {WORKSPACE_FILES.map((f) => (
            <FileRow key={f} name={f} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FileRow({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-1 py-1 rounded hover:bg-[#2a2a2a] cursor-pointer group">
      <FileIcon />
      <span className="text-xs text-gray-300 flex-1">{name}</span>
      <button className="text-[10px] text-gray-600 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Save
      </button>
    </div>
  );
}

function FileIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
