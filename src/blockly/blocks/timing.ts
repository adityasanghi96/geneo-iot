import * as Blockly from 'blockly';

export function defineTimingBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'timing_wait',
      message0: 'wait %1 %2',
      args0: [
        {
          type: 'field_number',
          name: 'DURATION',
          value: 1,
          min: 0,
          precision: 0.001,
        },
        {
          type: 'field_dropdown',
          name: 'UNIT',
          options: [
            ['seconds', 'sec'],
            ['milliseconds', 'ms'],
          ],
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#0f766e',
      tooltip: 'Pause execution for the specified duration',
      helpUrl: '',
    },
    {
      type: 'timing_forever',
      message0: 'repeat forever %1',
      args0: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: '#16a34a',
      tooltip: 'Repeat the contained blocks forever',
      helpUrl: '',
    },
    {
      type: 'timing_repeat_n',
      message0: 'repeat %1 times %2',
      args0: [
        {
          type: 'field_number',
          name: 'TIMES',
          value: 10,
          min: 1,
          precision: 1,
        },
        { type: 'input_statement', name: 'DO' },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#16a34a',
      tooltip: 'Repeat the contained blocks N times',
      helpUrl: '',
    },
  ]);
}
