import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WorkspaceState {
  xml: string;
  generatedCode: string;
}

const initialXml = `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="project_info" x="50" y="30">
    <value name="AUTHOR">
      <shadow type="text"><field name="TEXT">User</field></shadow>
    </value>
    <value name="DESCRIPTION">
      <shadow type="text"><field name="TEXT">My project</field></shadow>
    </value>
  </block>
  <block type="sketch" x="50" y="220"></block>
</xml>`;

const initialState: WorkspaceState = {
  xml: initialXml,
  generatedCode: '# Connect blocks to generate MicroPython code\n',
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setXml(state, action: PayloadAction<string>) {
      state.xml = action.payload;
    },
    setGeneratedCode(state, action: PayloadAction<string>) {
      state.generatedCode = action.payload;
    },
  },
});

export const { setXml, setGeneratedCode } = workspaceSlice.actions;
export default workspaceSlice.reducer;
