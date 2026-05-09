import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TabId } from '../../types';

interface UiState {
  activeTab: TabId;
  showCodePreview: boolean;
  showSimulator: boolean;
  showConnectionModal: boolean;
  consoleOutput: Array<{ id: string; timestamp: number; type: 'output' | 'error' | 'info'; text: string }>;
}

const initialState: UiState = {
  activeTab: 'blocks',
  showCodePreview: false,
  showSimulator: false,
  showConnectionModal: false,
  consoleOutput: [
    {
      id: '0',
      timestamp: Date.now(),
      type: 'info',
      text: 'Geneo IoT ready. Drag blocks to build your program.',
    },
  ],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<TabId>) {
      state.activeTab = action.payload;
    },
    toggleCodePreview(state) {
      state.showCodePreview = !state.showCodePreview;
    },
    toggleSimulator(state) {
      state.showSimulator = !state.showSimulator;
    },
    setShowConnectionModal(state, action: PayloadAction<boolean>) {
      state.showConnectionModal = action.payload;
    },
    appendConsole(
      state,
      action: PayloadAction<{ type: 'output' | 'error' | 'info'; text: string }>
    ) {
      state.consoleOutput.push({
        id: String(Date.now() + Math.random()),
        timestamp: Date.now(),
        type: action.payload.type,
        text: action.payload.text,
      });
    },
    clearConsole(state) {
      state.consoleOutput = [];
    },
  },
});

export const {
  setActiveTab,
  toggleCodePreview,
  toggleSimulator,
  setShowConnectionModal,
  appendConsole,
  clearConsole,
} = uiSlice.actions;
export default uiSlice.reducer;
