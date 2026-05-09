import { Provider } from 'react-redux';
import { store } from './store';
import TopNav from './components/layout/TopNav';
import ConnectionModal from './components/connection/ConnectionModal';
import BlocklyWorkspace from './components/workspace/BlocklyWorkspace';
import CodePreviewPanel from './components/panels/CodePreviewPanel';
import ConsolePanel from './components/panels/ConsolePanel';
import FilesPanel from './components/panels/FilesPanel';
import FirmwarePanel from './components/panels/FirmwarePanel';
import SimulatorPanel from './components/simulator/SimulatorPanel';
import { useAppSelector } from './store/hooks';
import type { TabId } from './types';

function AppInner() {
  const activeTab = useAppSelector((s) => s.ui.activeTab);
  const showCodePreview = useAppSelector((s) => s.ui.showCodePreview);
  const showSimulator = useAppSelector((s) => s.ui.showSimulator);
  const showConnectionModal = useAppSelector((s) => s.ui.showConnectionModal);

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <TopNav />
      {showConnectionModal && <ConnectionModal />}

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area — Blockly renders its own toolbox sidebar */}
        <MainArea
          activeTab={activeTab}
          showCodePreview={showCodePreview}
          showSimulator={showSimulator}
        />
      </div>
    </div>
  );
}

interface MainAreaProps {
  activeTab: TabId;
  showCodePreview: boolean;
  showSimulator: boolean;
}

function MainArea({ activeTab, showCodePreview, showSimulator }: MainAreaProps) {
  if (activeTab === 'console') {
    return <div className="flex-1 overflow-hidden"><ConsolePanel /></div>;
  }
  if (activeTab === 'files') {
    return <div className="flex-1 overflow-hidden"><FilesPanel /></div>;
  }
  if (activeTab === 'firmware') {
    return <div className="flex-1 overflow-hidden"><FirmwarePanel /></div>;
  }

  // Blocks tab — main view
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Blockly + Code Preview column */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Blockly canvas */}
        <div className={showCodePreview ? 'flex-3 overflow-hidden' : 'flex-1 overflow-hidden'}>
          <BlocklyWorkspace />
        </div>

        {/* Code Preview panel */}
        {showCodePreview && (
          <div className="flex-2 overflow-hidden border-t border-gray-200" style={{ minHeight: 180 }}>
            <CodePreviewPanel />
          </div>
        )}
      </div>

      {/* Simulator panel */}
      {showSimulator && (
        <div
          className="w-64 shrink-0 border-l border-gray-200 overflow-hidden"
        >
          <SimulatorPanel />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
