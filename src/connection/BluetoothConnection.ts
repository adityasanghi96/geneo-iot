// Nordic UART Service (NUS) — the de-facto REPL-over-BLE standard for MicroPython
const NUS_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const NUS_RX_CHAR = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // write (host→device)
const NUS_TX_CHAR = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // notify (device→host)

type OnData = (text: string) => void;
type OnClose = () => void;

export class BluetoothConnection {
  private device: BluetoothDevice | null = null;
  private rxChar: BluetoothRemoteGATTCharacteristic | null = null;
  private onData: OnData;
  private onClose: OnClose;

  constructor(onData: OnData, onClose: OnClose) {
    this.onData = onData;
    this.onClose = onClose;
  }

  static isSupported(): boolean {
    return 'bluetooth' in navigator;
  }

  async connect(): Promise<string> {
    const bt = navigator.bluetooth;

    const device = await bt.requestDevice({
      filters: [
        { namePrefix: 'ESP32' },
        { namePrefix: 'mpy' },
        { namePrefix: 'MicroPython' },
      ],
      optionalServices: [NUS_SERVICE],
    });

    this.device = device;
    device.addEventListener('gattserverdisconnected', () => this.handleClose());

    const server = await device.gatt!.connect();
    const service = await server.getPrimaryService(NUS_SERVICE);

    this.rxChar = await service.getCharacteristic(NUS_RX_CHAR);
    const txChar = await service.getCharacteristic(NUS_TX_CHAR);

    txChar.addEventListener('characteristicvaluechanged', (e: Event) => {
      const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;
      this.onData(new TextDecoder().decode(value));
    });
    await txChar.startNotifications();

    return device.name ?? 'BLE Device';
  }

  async write(text: string): Promise<void> {
    if (!this.rxChar) return;
    const encoder = new TextEncoder();
    // BLE MTU is typically 20 bytes; chunk if needed
    const bytes = encoder.encode(text);
    for (let i = 0; i < bytes.length; i += 20) {
      await this.rxChar.writeValue(bytes.slice(i, i + 20));
    }
  }

  async disconnect(): Promise<void> {
    try { this.device?.gatt?.disconnect(); } catch { /* ok */ }
    this.device = null;
    this.rxChar = null;
  }

  private handleClose() {
    this.device = null;
    this.rxChar = null;
    this.onClose();
  }
}
