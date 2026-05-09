import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DeviceState, ConnectionType } from '../../types';

const initialState: DeviceState = {
  connected: false,
  connectionType: null,
  deviceName: '',
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    connectDevice(
      state,
      action: PayloadAction<{ connectionType: ConnectionType; deviceName: string }>
    ) {
      state.connected = true;
      state.connectionType = action.payload.connectionType;
      state.deviceName = action.payload.deviceName;
    },
    disconnectDevice(state) {
      state.connected = false;
      state.connectionType = null;
      state.deviceName = '';
    },
  },
});

export const { connectDevice, disconnectDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
