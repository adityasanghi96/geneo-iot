import * as Blockly from 'blockly';

export function defineNetlogicBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'netlogic_read_sensor',
      message0: 'read sensor %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SENSOR',
          options: [
            ['Temperature', 'temperature'],
            ['Humidity', 'humidity'],
            ['Light', 'light'],
            ['Distance', 'distance'],
          ],
        },
      ],
      output: 'Number',
      colour: '#7c3aed',
      tooltip: 'Read a sensor value from NetLogic',
      helpUrl: '',
    },
    {
      type: 'netlogic_send_data',
      message0: 'send to NetLogic key %1 value %2',
      args0: [
        { type: 'field_input', name: 'KEY', text: 'sensor1' },
        {
          type: 'input_value',
          name: 'VALUE',
          check: ['String', 'Number'],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: '#7c3aed',
      tooltip: 'Send data to the NetLogic cloud platform',
      helpUrl: '',
    },
    {
      type: 'netlogic_if_cloud',
      message0: 'if NetLogic key %1 equals %2 %3',
      args0: [
        { type: 'field_input', name: 'KEY', text: 'cmd' },
        { type: 'field_input', name: 'VALUE', text: 'on' },
        { type: 'input_statement', name: 'DO' },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#7c3aed',
      tooltip: 'Execute blocks when a NetLogic cloud key matches a value',
      helpUrl: '',
    },
  ]);
}
