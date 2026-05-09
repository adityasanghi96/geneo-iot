import { PythonGenerator, Order } from 'blockly/python';

export function registerNetlogicGenerators(gen: PythonGenerator) {
  gen.forBlock['netlogic_read_sensor'] = function (block) {
    const sensor = block.getFieldValue('SENSOR');
    return [`_netlogic_read('${sensor}')`, Order.FUNCTION_CALL];
  };

  gen.forBlock['netlogic_send_data'] = function (block, generator) {
    const key = block.getFieldValue('KEY');
    const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC) || "''";
    return `_netlogic_send('${key}', ${value})\n`;
  };

  gen.forBlock['netlogic_if_cloud'] = function (block, generator) {
    const key = block.getFieldValue('KEY');
    const value = block.getFieldValue('VALUE');
    const body = generator.statementToCode(block, 'DO') || generator.PASS;
    return `if _netlogic_get('${key}') == '${value}':\n${body}`;
  };
}
