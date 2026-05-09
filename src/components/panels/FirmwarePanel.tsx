import { useAppSelector } from '../../store/hooks';

export default function FirmwarePanel() {
  const connected = useAppSelector((s) => s.device.connected);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] p-4 gap-4">
      <div className="flex items-center gap-2">
        <ChipIcon />
        <span className="text-sm text-gray-300 font-medium">Firmware Manager</span>
      </div>

      <div className="rounded border border-[#3c3c3c] p-3">
        <p className="text-xs text-gray-500 mb-2">Target Device</p>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span className="text-xs text-gray-300">
            {connected ? 'ESP32 Connected' : 'No device connected'}
          </span>
        </div>
      </div>

      <div className="rounded border border-[#3c3c3c] p-3">
        <p className="text-xs text-gray-500 mb-2">MicroPython Firmware</p>
        <p className="text-xs text-gray-400">v1.22.0 — ESP32 Generic</p>
        <button
          disabled={!connected}
          className="mt-2 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Flash Firmware
        </button>
      </div>

      <div className="rounded border border-[#3c3c3c] p-3">
        <p className="text-xs text-gray-500 mb-2">Upload Program</p>
        <p className="text-xs text-gray-400 mb-2">Push generated main.py to device</p>
        <button
          disabled={!connected}
          className="px-3 py-1.5 text-xs bg-green-700 text-white rounded hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Upload main.py
        </button>
      </div>

      {!connected && (
        <p className="text-xs text-gray-600 text-center mt-auto">
          Connect via Bluetooth or Serial to manage firmware
        </p>
      )}
    </div>
  );
}

function ChipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M9 7V4M12 7V4M15 7V4M9 20v-3M12 20v-3M15 20v-3M4 9h3M4 12h3M4 15h3M17 9h3M17 12h3M17 15h3" />
    </svg>
  );
}
