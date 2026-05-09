import * as Blockly from 'blockly';

export function defineProjectBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'project_info',
      message0: 'Project Info',
      message1: 'Author %1',
      args1: [
        { type: 'input_value', name: 'AUTHOR', check: 'String' },
      ],
      message2: 'Description %1',
      args2: [
        { type: 'input_value', name: 'DESCRIPTION', check: 'String' },
      ],
      colour: '#5b67a5',
      tooltip: 'Project metadata block',
      helpUrl: '',
    },
    {
      type: 'sketch',
      message0: 'Sketch %1',
      args0: [{ type: 'input_statement', name: 'BODY' }],
      colour: '#5b67a5',
      tooltip: 'Main sketch container. Place your program blocks inside.',
      helpUrl: '',
    },
  ]);
}
