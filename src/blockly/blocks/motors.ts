import * as Blockly from 'blockly';

export function defineMotorBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'motor_dc_set_speed',
      message0: 'DC motor pin %1 speed %2 %',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 5,
          min: 0,
          max: 39,
          precision: 1,
        },
        {
          type: 'field_number',
          name: 'SPEED',
          value: 100,
          min: -100,
          max: 100,
          precision: 1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#0f766e',
      tooltip: 'Set DC motor speed (-100 to 100, negative = reverse)',
      helpUrl: '',
    },
    {
      type: 'motor_dc_stop',
      message0: 'stop DC motor pin %1',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 5,
          min: 0,
          max: 39,
          precision: 1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#0f766e',
      tooltip: 'Stop DC motor',
      helpUrl: '',
    },
    {
      type: 'motor_servo_set_angle',
      message0: 'servo pin %1 angle %2 °',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 14,
          min: 0,
          max: 39,
          precision: 1,
        },
        {
          type: 'field_number',
          name: 'ANGLE',
          value: 90,
          min: 0,
          max: 180,
          precision: 1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#0f766e',
      tooltip: 'Set servo angle (0-180 degrees)',
      helpUrl: '',
    },
  ]);
}
