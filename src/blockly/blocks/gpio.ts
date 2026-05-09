import * as Blockly from 'blockly';

export function defineGpioBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'gpio_set_pin_mode',
      message0: 'set pin %1 mode %2',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 2,
          min: 0,
          max: 39,
          precision: 1,
        },
        {
          type: 'field_dropdown',
          name: 'MODE',
          options: [
            ['OUTPUT', 'OUT'],
            ['INPUT', 'IN'],
          ],
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#374151',
      tooltip: 'Set a GPIO pin mode',
      helpUrl: '',
    },
    {
      type: 'gpio_digital_write',
      message0: 'digital write pin %1 = %2',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 2,
          min: 0,
          max: 39,
          precision: 1,
        },
        {
          type: 'field_dropdown',
          name: 'VALUE',
          options: [
            ['HIGH (1)', '1'],
            ['LOW (0)', '0'],
          ],
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#374151',
      tooltip: 'Write a HIGH or LOW value to a digital pin',
      helpUrl: '',
    },
    {
      type: 'gpio_digital_read',
      message0: 'digital read pin %1',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 0,
          min: 0,
          max: 39,
          precision: 1,
        },
      ],
      output: 'Number',
      colour: '#374151',
      tooltip: 'Read a digital value from a pin',
      helpUrl: '',
    },
    {
      type: 'gpio_analog_read',
      message0: 'analog read pin %1',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 34,
          min: 32,
          max: 39,
          precision: 1,
        },
      ],
      output: 'Number',
      colour: '#374151',
      tooltip: 'Read an analog value (0-4095) from an ADC pin',
      helpUrl: '',
    },
  ]);
}
