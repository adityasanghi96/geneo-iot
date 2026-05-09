import { PythonGenerator, Order } from 'blockly/python';

export function registerProjectGenerators(gen: PythonGenerator) {
  gen.forBlock['project_info'] = function (block, generator) {
    const author = generator.valueToCode(block, 'AUTHOR', Order.ATOMIC) || "'User'";
    const description = generator.valueToCode(block, 'DESCRIPTION', Order.ATOMIC) || "'My project'";
    return `# Project: ${description.replace(/'/g, '')}\n# Author: ${author.replace(/'/g, '')}\n`;
  };

  gen.forBlock['sketch'] = function (block, generator) {
    const body = generator.statementToCode(block, 'BODY');
    return body || '';
  };
}
