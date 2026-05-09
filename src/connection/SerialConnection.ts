// Web Serial API types (not in standard TS lib yet)
interface SerialPortInfo { usbVendorId?: number; usbProductId?: number; }
interface SerialPort {
  open(opts: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  getInfo(): SerialPortInfo;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
}

type OnData = (text: string) => void;
type OnClose = () => void;

export class SerialConnection {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<string> | null = null;
  private writer: WritableStreamDefaultWriter<string> | null = null;
  private onData: OnData;
  private onClose: OnClose;
  private reading = false;

  constructor(onData: OnData, onClose: OnClose) {
    this.onData = onData;
    this.onClose = onClose;
  }

  static isSupported(): boolean {
    return 'serial' in navigator;
  }

  async connect(baudRate = 115200): Promise<string> {
    const serial = (navigator as Navigator & { serial: { requestPort(): Promise<SerialPort> } }).serial;
    const port = await serial.requestPort();
    await port.open({ baudRate });
    this.port = port;

    const textDecoder = new TextDecoderStream();
    const textEncoder = new TextEncoderStream();

    (port.readable as ReadableStream<Uint8Array>)
      .pipeTo(textDecoder.writable as unknown as WritableStream<Uint8Array>)
      .catch(() => this.handleClose());
    (textEncoder.readable as ReadableStream<Uint8Array>)
      .pipeTo(port.writable as WritableStream<Uint8Array>)
      .catch(() => this.handleClose());

    this.reader = textDecoder.readable.getReader();
    this.writer = textEncoder.writable.getWriter();

    this.startReading();

    const info = port.getInfo();
    return `USB Serial (${info.usbVendorId ? `VID:${info.usbVendorId.toString(16).toUpperCase()}` : 'Unknown'})`;
  }

  private async startReading() {
    this.reading = true;
    try {
      while (this.reading && this.reader) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) this.onData(value);
      }
    } catch {
      // connection closed
    } finally {
      this.handleClose();
    }
  }

  async write(text: string): Promise<void> {
    await this.writer?.write(text);
  }

  async disconnect(): Promise<void> {
    this.reading = false;
    try { await this.reader?.cancel(); } catch { /* ok */ }
    try { await this.writer?.close(); } catch { /* ok */ }
    try { await this.port?.close(); } catch { /* ok */ }
    this.port = null;
    this.reader = null;
    this.writer = null;
  }

  private handleClose() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.onClose();
  }
}
