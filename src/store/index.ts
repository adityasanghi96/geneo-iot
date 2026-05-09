import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from './slices/workspaceSlice';
import projectReducer from './slices/projectSlice';
import deviceReducer from './slices/deviceSlice';
import simulatorReducer from './slices/simulatorSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    project: projectReducer,
    device: deviceReducer,
    simulator: simulatorReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
