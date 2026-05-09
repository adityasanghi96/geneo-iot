import * as Blockly from 'blockly';
import type { AppDispatch } from '../store';
import { setPinState, setServoAngle, setRunning } from '../store/slices/simulatorSlice';
import { appendConsole } from '../store/slices/uiSlice';

export class BlockExecutor {
  private dispatch: AppDispatch;
  private aborted = false;
  private timeouts: ReturnType<typeof setTimeout>[] = [];

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  abort() {
    this.aborted = true;
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
    this.dispatch(setRunning(false));
    this.log('info', 'Simulation stopped.');
  }

  private log(type: 'output' | 'error' | 'info', text: string) {
    this.dispatch(appendConsole({ type, text }));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.aborted) return resolve();
      const t = setTimeout(() => {
        resolve();
      }, ms);
      this.timeouts.push(t);
    });
  }

  async run(workspace: Blockly.Workspace) {
    if (this.aborted) return;
    this.log('info', 'Starting simulation...');

    const topBlocks = workspace.getTopBlocks(true);
    for (const block of topBlocks) {
      if (this.aborted) break;
      if (block.type === 'sketch') {
        await this.executeStatement(block.getInputTargetBlock('BODY'));
      }
    }

    if (!this.aborted) {
      this.log('info', 'Simulation complete.');
      this.dispatch(setRunning(false));
    }
  }

  private async executeStatement(block: Blockly.Block | null) {
    let current: Blockly.Block | null = block;
    while (current && !this.aborted) {
      await this.executeBlock(current);
      current = current.getNextBlock();
    }
  }

  private async executeBlock(block: Blockly.Block) {
    if (this.aborted) return;

    switch (block.type) {
      case 'gpio_digital_write': {
        const pin = Number(block.getFieldValue('PIN'));
        const value = Number(block.getFieldValue('VALUE')) as 0 | 1;
        this.dispatch(setPinState({ pin, value }));
        this.log('output', `Pin ${pin} → ${value === 1 ? 'HIGH' : 'LOW'}`);
        break;
      }

      case 'gpio_set_pin_mode': {
        const pin = Number(block.getFieldValue('PIN'));
        const mode = block.getFieldValue('MODE');
        this.log('output', `Pin ${pin} mode → ${mode}`);
        break;
      }

      case 'motor_servo_set_angle': {
        const pin = Number(block.getFieldValue('PIN'));
        const angle = Number(block.getFieldValue('ANGLE'));
        this.dispatch(setServoAngle({ pin, angle }));
        this.log('output', `Servo pin ${pin} → ${angle}°`);
        break;
      }

      case 'display_serial_print': {
        const valueBlock = block.getInputTargetBlock('VALUE');
        const text = valueBlock ? this.evalValue(valueBlock) : '';
        this.log('output', String(text));
        break;
      }

      case 'timing_wait': {
        const duration = Number(block.getFieldValue('DURATION'));
        const unit = block.getFieldValue('UNIT');
        const ms = unit === 'ms' ? duration : duration * 1000;
        this.log('output', `Waiting ${duration} ${unit}...`);
        await this.sleep(ms);
        break;
      }

      case 'timing_forever': {
        // Run max 30 iterations to prevent browser lockup
        const MAX_ITERS = 30;
        for (let i = 0; i < MAX_ITERS && !this.aborted; i++) {
          await this.executeStatement(block.getInputTargetBlock('DO'));
        }
        break;
      }

      case 'timing_repeat_n': {
        const times = Number(block.getFieldValue('TIMES'));
        for (let i = 0; i < times && !this.aborted; i++) {
          await this.executeStatement(block.getInputTargetBlock('DO'));
        }
        break;
      }

      case 'controls_if': {
        const condition = block.getInputTargetBlock('IF0');
        const result = condition ? this.evalValue(condition) : false;
        if (result) {
          await this.executeStatement(block.getInputTargetBlock('DO0'));
        }
        break;
      }

      default:
        // Skip unknown block types silently
        break;
    }
  }

  private evalValue(block: Blockly.Block): unknown {
    switch (block.type) {
      case 'logic_boolean':
        return block.getFieldValue('BOOL') === 'TRUE';
      case 'math_number':
        return Number(block.getFieldValue('NUM'));
      case 'text':
        return block.getFieldValue('TEXT');
      case 'logic_compare': {
        const a = this.evalValue(block.getInputTargetBlock('A')!);
        const b = this.evalValue(block.getInputTargetBlock('B')!);
        const op = block.getFieldValue('OP');
        switch (op) {
          case 'EQ': return a === b;
          case 'NEQ': return a !== b;
          case 'LT': return (a as number) < (b as number);
          case 'LTE': return (a as number) <= (b as number);
          case 'GT': return (a as number) > (b as number);
          case 'GTE': return (a as number) >= (b as number);
          default: return false;
        }
      }
      case 'math_arithmetic': {
        const a = Number(this.evalValue(block.getInputTargetBlock('A')!));
        const b = Number(this.evalValue(block.getInputTargetBlock('B')!));
        const op = block.getFieldValue('OP');
        switch (op) {
          case 'ADD': return a + b;
          case 'MINUS': return a - b;
          case 'MULTIPLY': return a * b;
          case 'DIVIDE': return b !== 0 ? a / b : 0;
          case 'POWER': return Math.pow(a, b);
          default: return 0;
        }
      }
      default:
        return 0;
    }
  }
}
