import * as Blockly from 'blockly';

export function defineDisplayBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'display_oled_init',
      message0: 'init OLED SDA %1 SCL %2',
      args0: [
        { type: 'field_number', name: 'SDA', value: 21, min: 0, max: 39, precision: 1 },
        { type: 'field_number', name: 'SCL', value: 22, min: 0, max: 39, precision: 1 },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#0369a1',
      tooltip: 'Initialize the OLED display (SSD1306 128x64)',
      helpUrl: '',
    },
    {
      type: 'display_oled_text',
      message0: 'OLED show text %1 at x %2 y %3',
      args0: [
        {
          type: 'input_value',
          name: 'TEXT',
          check: ['String', 'Number'],
        },
        { type: 'field_number', name: 'X', value: 0, min: 0, max: 127, precision: 1 },
        { type: 'field_number', name: 'Y', value: 0, min: 0, max: 63, precision: 1 },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: '#0369a1',
      tooltip: 'Display text on OLED at given coordinates',
      helpUrl: '',
    },
    {
      type: 'display_oled_clear',
      message0: 'OLED clear screen',
      previousStatement: null,
      nextStatement: null,
      colour: '#0369a1',
      tooltip: 'Clear the OLED display',
      helpUrl: '',
    },
    {
      type: 'display_serial_print',
      message0: 'serial print %1',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE',
          check: ['String', 'Number'],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: '#0369a1',
      tooltip: 'Print a value to the serial monitor',
      helpUrl: '',
    },
  ]);
}
