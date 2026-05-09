import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveTab, toggleCodePreview, toggleSimulator, setShowConnectionModal } from '../../store/slices/uiSlice';
import { setRunning } from '../../store/slices/simulatorSlice';
import { APP_NAME } from '../../config';
import { useProject } from '../../hooks/useProject';
import type { TabId } from '../../types';

const TABS: { id: TabId; label: string }[] = [
  { id: 'blocks', label: 'Blocks' },
  { id: 'console', label: 'Console' },
  { id: 'files', label: 'Files' },
  { id: 'firmware', label: 'Firmware' },
];

export default function TopNav() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((s) => s.ui.activeTab);
  const running = useAppSelector((s) => s.simulator.running);
  const connected = useAppSelector((s) => s.device.connected);
  const device = useAppSelector((s) => s.device);
  const showCodePreview = useAppSelector((s) => s.ui.showCodePreview);
  const showSimulator = useAppSelector((s) => s.ui.showSimulator);
  const { exportPython, exportJSON } = useProject();

  return (
    <header className="flex items-center h-10 bg-white border-b border-gray-200 select-none shrink-0 px-1">
      {/* Logo */}
      <div className="flex items-center gap-1 px-3 mr-2 border-r border-gray-200">
        <span className="font-bold text-sm text-blue-600 tracking-tight">{APP_NAME}</span>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setActiveTab(tab.id))}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded">
          Image Classifier
        </button>
        <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded">
          Teachable Machine
        </button>
        <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded">
          App Inventor
        </button>
      </nav>

      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-1 px-2">
        {/* Connect button — opens the connection modal */}
        <button
          onClick={() => dispatch(setShowConnectionModal(true))}
          title="Connect Device"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
            connected
              ? 'border-green-400 text-green-600 bg-green-50 hover:bg-green-100'
              : 'border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {connected ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {device.deviceName || 'Connected'}
            </>
          ) : (
            <>
              <BluetoothIcon />
              Connect
            </>
          )}
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Toggle Code Preview */}
        <button
          onClick={() => dispatch(toggleCodePreview())}
          title="Toggle Code Preview"
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            showCodePreview
              ? 'border-blue-400 text-blue-600 bg-blue-50'
              : 'border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {'</>'}
        </button>

        {/* Toggle Simulator */}
        <button
          onClick={() => dispatch(toggleSimulator())}
          title="Toggle Simulator"
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            showSimulator
              ? 'border-green-400 text-green-600 bg-green-50'
              : 'border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          Sim
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Run */}
        <button
          onClick={() => dispatch(setRunning(true))}
          disabled={running}
          title="Run Program"
          className="p-1.5 rounded text-green-600 hover:bg-green-50 disabled:opacity-40 transition-colors"
        >
          <RunIcon />
        </button>

        {/* Stop */}
        <button
          onClick={() => dispatch(setRunning(false))}
          disabled={!running}
          title="Stop Program"
          className="p-1.5 rounded text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
        >
          <StopIcon />
        </button>

        {/* Export Python */}
        <button
          onClick={exportPython}
          title="Download main.py"
          className="p-1.5 rounded text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ExportIcon />
        </button>

        {/* Save project JSON */}
        <button
          onClick={exportJSON}
          title="Save project as JSON"
          className="p-1.5 rounded text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <SaveIcon />
        </button>

        {/* Profile */}
        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold ml-1">
          U
        </div>
      </div>
    </header>
  );
}

function BluetoothIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
    </svg>
  );
}


function RunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
