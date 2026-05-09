// MicroPython WebREPL protocol over WebSocket (port 8266)
type OnData = (text: string) => void;
type OnClose = () => void;

const WEBREPL_PORT = 8266;

export class WebReplConnection {
  private ws: WebSocket | null = null;
  private onData: OnData;
  private onClose: OnClose;
  private authenticated = false;

  constructor(onData: OnData, onClose: OnClose) {
    this.onData = onData;
    this.onClose = onClose;
  }

  static isSupported(): boolean {
    return typeof WebSocket !== 'undefined';
  }

  connect(ip: string, password: string): Promise<string> {
    this.authenticated = false;

    return new Promise((resolve, reject) => {
      const url = `ws://${ip}:${WEBREPL_PORT}`;
      const ws = new WebSocket(url);
      ws.binaryType = 'arraybuffer';
      this.ws = ws;

      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('Connection timed out'));
      }, 8000);

      ws.onopen = () => {
        clearTimeout(timeout);
      };

      ws.onmessage = (event) => {
        const text =
          typeof event.data === 'string'
            ? event.data
            : new TextDecoder().decode(event.data as ArrayBuffer);

        if (!this.authenticated) {
          if (text.includes('Password:')) {
            ws.send(password + '\r\n');
          } else if (text.toLowerCase().includes('access denied')) {
            ws.close();
            reject(new Error('Wrong WebREPL password'));
          } else if (text.includes('WebREPL connected') || text.includes('>>>')) {
            this.authenticated = true;
            resolve(`ESP32 @ ${ip}`);
            this.onData(text);
          } else {
            this.onData(text);
          }
        } else {
          this.onData(text);
        }
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Cannot reach ${url}`));
      };

      ws.onclose = () => {
        clearTimeout(timeout);
        this.handleClose();
        if (!this.authenticated) reject(new Error('Connection closed'));
      };
    });
  }

  write(text: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(text);
    }
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }

  private handleClose() {
    this.authenticated = false;
    this.ws = null;
    this.onClose();
  }
}
