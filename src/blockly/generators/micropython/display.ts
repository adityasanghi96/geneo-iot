import { PythonGenerator, Order } from 'blockly/python';

export function registerDisplayGenerators(gen: PythonGenerator) {
  gen.forBlock['display_oled_init'] = function (block) {
    const sda = block.getFieldValue('SDA');
    const scl = block.getFieldValue('SCL');
    return (
      `_i2c = I2C(0, sda=Pin(${sda}), scl=Pin(${scl}))\n` +
      `_oled = ssd1306.SSD1306_I2C(128, 64, _i2c)\n`
    );
  };

  gen.forBlock['display_oled_text'] = function (block, generator) {
    const text = generator.valueToCode(block, 'TEXT', Order.ATOMIC) || "''";
    const x = block.getFieldValue('X');
    const y = block.getFieldValue('Y');
    return (
      `_oled.text(str(${text}), ${x}, ${y})\n` +
      `_oled.show()\n`
    );
  };

  gen.forBlock['display_oled_clear'] = function () {
    return `_oled.fill(0)\n_oled.show()\n`;
  };

  gen.forBlock['display_serial_print'] = function (block, generator) {
    const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC) || "''";
    return `print(${value})\n`;
  };
}
