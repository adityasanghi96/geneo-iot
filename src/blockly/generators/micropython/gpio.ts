import { PythonGenerator, Order } from 'blockly/python';

export function registerGpioGenerators(gen: PythonGenerator) {
  gen.forBlock['gpio_set_pin_mode'] = function (block) {
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    return `machine.Pin(${pin}, machine.Pin.${mode})\n`;
  };

  gen.forBlock['gpio_digital_write'] = function (block) {
    const pin = block.getFieldValue('PIN');
    const value = block.getFieldValue('VALUE');
    return `machine.Pin(${pin}, machine.Pin.OUT).value(${value})\n`;
  };

  gen.forBlock['gpio_digital_read'] = function (block) {
    const pin = block.getFieldValue('PIN');
    return [`machine.Pin(${pin}, machine.Pin.IN).value()`, Order.FUNCTION_CALL];
  };

  gen.forBlock['gpio_analog_read'] = function (block) {
    const pin = block.getFieldValue('PIN');
    return [`machine.ADC(machine.Pin(${pin})).read()`, Order.FUNCTION_CALL];
  };
}
