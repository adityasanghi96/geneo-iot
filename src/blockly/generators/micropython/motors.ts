import { PythonGenerator } from 'blockly/python';

export function registerMotorGenerators(gen: PythonGenerator) {
  gen.forBlock['motor_dc_set_speed'] = function (block) {
    const pin = block.getFieldValue('PIN');
    const speed = block.getFieldValue('SPEED');
    const duty = Math.round((Math.abs(Number(speed)) / 100) * 1023);
    const direction = Number(speed) >= 0 ? 1 : 0;
    return (
      `_dc_pwm_${pin} = machine.PWM(machine.Pin(${pin}), freq=1000)\n` +
      `_dc_pwm_${pin}.duty(${duty})  # direction=${direction}\n`
    );
  };

  gen.forBlock['motor_dc_stop'] = function (block) {
    const pin = block.getFieldValue('PIN');
    return `machine.PWM(machine.Pin(${pin}), freq=1000).duty(0)\n`;
  };

  gen.forBlock['motor_servo_set_angle'] = function (block) {
    const pin = block.getFieldValue('PIN');
    const angle = block.getFieldValue('ANGLE');
    // Servo pulse: 40-115 duty for 0-180° at 50Hz on ESP32 (0-1023 scale)
    const duty = Math.round(40 + (Number(angle) / 180) * 75);
    return (
      `_servo_${pin} = PWM(machine.Pin(${pin}), freq=50)\n` +
      `_servo_${pin}.duty(${duty})  # ${angle} degrees\n`
    );
  };
}
