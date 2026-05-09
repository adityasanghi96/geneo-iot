import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PinStates, SimulatorComponent } from '../../types';
import { ONBOARD_LED_PIN } from '../../config';

interface SimulatorState {
  running: boolean;
  pinStates: PinStates;
  components: SimulatorComponent[];
  servoAngles: Record<number, number>;
}

const initialState: SimulatorState = {
  running: false,
  pinStates: {},
  components: [
    { id: 'led-builtin', kind: 'led', pin: ONBOARD_LED_PIN, label: 'Built-in LED' },
    { id: 'led-13', kind: 'led', pin: 13, label: 'LED (Pin 13)' },
    { id: 'button-0', kind: 'button', pin: 0, label: 'Button (Pin 0)' },
    { id: 'servo-14', kind: 'servo', pin: 14, label: 'Servo (Pin 14)' },
    { id: 'buzzer-12', kind: 'buzzer', pin: 12, label: 'Buzzer (Pin 12)' },
  ],
  servoAngles: { 14: 0 },
};

const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    setRunning(state, action: PayloadAction<boolean>) {
      state.running = action.payload;
      if (!action.payload) {
        state.pinStates = {};
        state.servoAngles = { 14: 0 };
      }
    },
    setPinState(state, action: PayloadAction<{ pin: number; value: 0 | 1 }>) {
      state.pinStates[action.payload.pin] = action.payload.value;
    },
    setServoAngle(state, action: PayloadAction<{ pin: number; angle: number }>) {
      state.servoAngles[action.payload.pin] = action.payload.angle;
    },
    resetSimulator(state) {
      state.running = false;
      state.pinStates = {};
      state.servoAngles = { 14: 0 };
    },
    addComponent(state, action: PayloadAction<SimulatorComponent>) {
      state.components.push(action.payload);
    },
    removeComponent(state, action: PayloadAction<string>) {
      state.components = state.components.filter((c) => c.id !== action.payload);
    },
  },
});

export const {
  setRunning,
  setPinState,
  setServoAngle,
  resetSimulator,
  addComponent,
  removeComponent,
} = simulatorSlice.actions;
export default simulatorSlice.reducer;
