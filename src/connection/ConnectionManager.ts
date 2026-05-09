import { SerialConnection } from './SerialConnection';
import { BluetoothConnection } from './BluetoothConnection';
import { WebReplConnection } from './WebReplConnection';

type OnData = (text: string) => void;
type OnClose = () => void;

type ActiveConnection = SerialConnection | BluetoothConnection | WebReplConnection | null;

/**
 * Singleton façade used by the React app.
 * Holds the currently active connection and exposes write / disconnect.
 */
class ConnectionManager {
  private active: ActiveConnection = null;

  async connectSerial(baudRate: number, onData: OnData, onClose: OnClose): Promise<string> {
    await this.disconnectCurrent();
    const conn = new SerialConnection(onData, () => { this.active = null; onClose(); });
    const name = await conn.connect(baudRate);
    this.active = conn;
    return name;
  }

  async connectBluetooth(onData: OnData, onClose: OnClose): Promise<string> {
    await this.disconnectCurrent();
    const conn = new BluetoothConnection(onData, () => { this.active = null; onClose(); });
    const name = await conn.connect();
    this.active = conn;
    return name;
  }

  async connectWebRepl(ip: string, password: string, onData: OnData, onClose: OnClose): Promise<string> {
    await this.disconnectCurrent();
    const conn = new WebReplConnection(onData, () => { this.active = null; onClose(); });
    const name = await conn.connect(ip, password);
    this.active = conn;
    return name;
  }

  write(text: string): void {
    if (!this.active) return;
    if (this.active instanceof SerialConnection) this.active.write(text);
    else if (this.active instanceof BluetoothConnection) this.active.write(text);
    else if (this.active instanceof WebReplConnection) this.active.write(text);
  }

  async disconnectCurrent(): Promise<void> {
    if (!this.active) return;
    if (this.active instanceof SerialConnection) await this.active.disconnect();
    else if (this.active instanceof BluetoothConnection) await this.active.disconnect();
    else if (this.active instanceof WebReplConnection) this.active.disconnect();
    this.active = null;
  }

  isConnected(): boolean {
    return this.active !== null;
  }
}

export const connectionManager = new ConnectionManager();
