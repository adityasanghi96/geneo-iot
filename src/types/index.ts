export type TabId = 'blocks' | 'console' | 'files' | 'firmware';

export type ConnectionType = 'bluetooth' | 'serial' | null;

export interface ProjectMeta {
  name: string;
  author: string;
  description: string;
}

export interface DeviceState {
  connected: boolean;
  connectionType: ConnectionType;
  deviceName: string;
}

export interface PinStates {
  [pin: number]: 0 | 1;
}

export type ComponentKind = 'led' | 'button' | 'servo' | 'buzzer';

export interface SimulatorComponent {
  id: string;
  kind: ComponentKind;
  pin: number;
  label: string;
}

export interface ConsoleEntry {
  id: string;
  timestamp: number;
  type: 'output' | 'error' | 'info';
  text: string;
}
