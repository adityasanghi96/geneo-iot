import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setShowConnectionModal } from '../../store/slices/uiSlice';
import { connectDevice, disconnectDevice } from '../../store/slices/deviceSlice';
import { appendConsole } from '../../store/slices/uiSlice';
import { connectionManager } from '../../connection/ConnectionManager';
import { SerialConnection } from '../../connection/SerialConnection';
import { BluetoothConnection } from '../../connection/BluetoothConnection';

type Tab = 'wifi' | 'serial' | 'bluetooth';

const BAUD_RATES = [9600, 19200, 38400, 57600, 74880, 115200, 230400, 460800, 921600];

export default function ConnectionModal() {
  const dispatch = useAppDispatch();
  const device = useAppSelector((s) => s.device);
  const [tab, setTab] = useState<Tab>('wifi');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // WiFi / WebREPL
  const [ip, setIp] = useState('192.168.4.1');
  const [wifiPassword, setWifiPassword] = useState('');

  // Serial
  const [baudRate, setBaudRate] = useState(115200);

  const close = () => dispatch(setShowConnectionModal(false));

  const log = (text: string, type: 'info' | 'error' | 'output' = 'info') => {
    dispatch(appendConsole({ type, text }));
  };

  const onClose = () => {
    dispatch(disconnectDevice());
    log('Device disconnected.', 'info');
  };

  const onData = (text: string) => {
    dispatch(appendConsole({ type: 'output', text: text.replace(/\r\n/g, '\n').trimEnd() }));
  };

  const handleConnectWifi = async () => {
    setError('');
    setBusy(true);
    try {
      const name = await connectionManager.connectWebRepl(ip, wifiPassword, onData, onClose);
      dispatch(connectDevice({ connectionType: 'serial', deviceName: name }));
      log(`Connected via WiFi/WebREPL to ${name}`, 'info');
      close();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleConnectSerial = async () => {
    setError('');
    setBusy(true);
    try {
      const name = await connectionManager.connectSerial(baudRate, onData, onClose);
      dispatch(connectDevice({ connectionType: 'serial', deviceName: name }));
      log(`Connected via USB Serial: ${name}`, 'info');
      close();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleConnectBluetooth = async () => {
    setError('');
    setBusy(true);
    try {
      const name = await connectionManager.connectBluetooth(onData, onClose);
      dispatch(connectDevice({ connectionType: 'bluetooth', deviceName: name }));
      log(`Connected via Bluetooth: ${name}`, 'info');
      close();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = async () => {
    await connectionManager.disconnectCurrent();
    dispatch(disconnectDevice());
    log('Disconnected.', 'info');
  };

  const tabCls = (t: Tab) =>
    `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
      tab === t
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-[480px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <PlugIcon />
            <span className="font-semibold text-gray-800">Connect Device</span>
          </div>
          <div className="flex items-center gap-3">
            {device.connected && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-600 font-medium">{device.deviceName}</span>
              </div>
            )}
            <button
              onClick={close}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-2">
          <button className={tabCls('wifi')} onClick={() => { setTab('wifi'); setError(''); }}>
            <WifiIcon /> WiFi / WebREPL
          </button>
          <button
            className={`${tabCls('serial')} ${!SerialConnection.isSupported() ? 'opacity-40' : ''}`}
            onClick={() => { setTab('serial'); setError(''); }}
            title={SerialConnection.isSupported() ? undefined : 'Requires Chrome/Edge'}
          >
            <UsbIcon /> USB / Serial
          </button>
          <button
            className={`${tabCls('bluetooth')} ${!BluetoothConnection.isSupported() ? 'opacity-40' : ''}`}
            onClick={() => { setTab('bluetooth'); setError(''); }}
            title={BluetoothConnection.isSupported() ? undefined : 'Requires Chrome/Edge'}
          >
            <BluetoothIcon /> Bluetooth
          </button>
        </div>

        {/* Tab body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === 'wifi' && (
            <>
              <p className="text-xs text-gray-500 leading-relaxed">
                Connect to your ESP32 over WiFi using MicroPython's built-in{' '}
                <strong>WebREPL</strong>. Make sure <code>webrepl_cfg.py</code> is present
                on your device and WebREPL is enabled.
              </p>
              <Field label="Device IP Address">
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="192.168.4.1"
                  className="input-field"
                />
              </Field>
              <Field label="WebREPL Password">
                <input
                  type="password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Leave blank if none"
                  className="input-field"
                />
              </Field>
              <HelpNote>
                Default AP: connect to <strong>MicroPython-xxxxxx</strong> WiFi first, then
                use IP <strong>192.168.4.1</strong>.
              </HelpNote>
            </>
          )}

          {tab === 'serial' && (
            <>
              {!SerialConnection.isSupported() ? (
                <BrowserWarning api="Web Serial API" />
              ) : (
                <>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Connect your ESP32 via USB cable. Your browser will prompt you to
                    select the serial port.
                  </p>
                  <Field label="Baud Rate">
                    <select
                      value={baudRate}
                      onChange={(e) => setBaudRate(Number(e.target.value))}
                      className="input-field"
                    >
                      {BAUD_RATES.map((r) => (
                        <option key={r} value={r}>
                          {r.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <HelpNote>
                    MicroPython REPL default baud: <strong>115200</strong>. Select the port
                    labelled <em>CP210x</em>, <em>CH340</em>, or <em>USB Serial</em>.
                  </HelpNote>
                </>
              )}
            </>
          )}

          {tab === 'bluetooth' && (
            <>
              {!BluetoothConnection.isSupported() ? (
                <BrowserWarning api="Web Bluetooth API" />
              ) : (
                <>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Connect via Bluetooth Low Energy using the{' '}
                    <strong>Nordic UART Service (NUS)</strong>. Your ESP32 must be running
                    a BLE UART firmware (e.g. MicroPython with BLE REPL enabled).
                  </p>
                  <HelpNote>
                    Device names scanned: <strong>ESP32</strong>, <strong>mpy</strong>,{' '}
                    <strong>MicroPython</strong>.
                  </HelpNote>
                </>
              )}
            </>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <span className="text-red-400 shrink-0">⚠</span>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
          {device.connected ? (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={close}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            {!device.connected && (
              <button
                onClick={
                  tab === 'wifi'
                    ? handleConnectWifi
                    : tab === 'serial'
                    ? handleConnectSerial
                    : handleConnectBluetooth
                }
                disabled={
                  busy ||
                  (tab === 'serial' && !SerialConnection.isSupported()) ||
                  (tab === 'bluetooth' && !BluetoothConnection.isSupported())
                }
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {busy && <Spinner />}
                {busy ? 'Connecting…' : 'Connect'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function HelpNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] text-gray-400 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
      {children}
    </p>
  );
}

function BrowserWarning({ api }: { api: string }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
      <strong>{api}</strong> is not supported in this browser.
      <br />
      Please use <strong>Chrome</strong> or <strong>Edge</strong> on desktop.
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
      <path d="M18 6L6 18M7 6v4M17 14v4M9 4v4M15 16v4M8 4H4v4h4zM20 16h-4v4h4z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
    </svg>
  );
}

function UsbIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v12M8 8l4-4 4 4M7 14h10a2 2 0 010 4H7a2 2 0 010-4z" />
    </svg>
  );
}

function BluetoothIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
    </svg>
  );
}
