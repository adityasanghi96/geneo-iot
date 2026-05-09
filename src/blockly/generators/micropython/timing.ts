import { PythonGenerator } from 'blockly/python';

export function registerTimingGenerators(gen: PythonGenerator) {
  gen.forBlock['timing_wait'] = function (block) {
    const duration = block.getFieldValue('DURATION');
    const unit = block.getFieldValue('UNIT');
    if (unit === 'ms') {
      return `time.sleep_ms(${Math.round(Number(duration))})\n`;
    }
    return `time.sleep(${duration})\n`;
  };

  gen.forBlock['timing_forever'] = function (block, generator) {
    const body = generator.statementToCode(block, 'DO') || generator.PASS;
    return `while True:\n${body}`;
  };

  gen.forBlock['timing_repeat_n'] = function (block, generator) {
    const times = block.getFieldValue('TIMES');
    const body = generator.statementToCode(block, 'DO') || generator.PASS;
    return `for _i in range(${times}):\n${body}`;
  };
}
