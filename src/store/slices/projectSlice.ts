import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProjectMeta } from '../../types';
import { DEFAULT_AUTHOR, DEFAULT_DESCRIPTION, APP_NAME } from '../../config';

const initialState: ProjectMeta = {
  name: APP_NAME,
  author: DEFAULT_AUTHOR,
  description: DEFAULT_DESCRIPTION,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<ProjectMeta>) {
      state.name = action.payload.name;
      state.author = action.payload.author;
      state.description = action.payload.description;
    },
    setAuthor(state, action: PayloadAction<string>) {
      state.author = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
  },
});

export const { setProject, setAuthor, setDescription, setName } = projectSlice.actions;
export default projectSlice.reducer;
