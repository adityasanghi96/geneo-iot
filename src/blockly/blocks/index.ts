import { defineProjectBlocks } from './project';
import { defineGpioBlocks } from './gpio';
import { defineTimingBlocks } from './timing';
import { defineMotorBlocks } from './motors';
import { defineIotBlocks } from './iot';
import { defineDisplayBlocks } from './display';
import { defineNetlogicBlocks } from './netlogic';

export function registerAllBlocks() {
  defineProjectBlocks();
  defineGpioBlocks();
  defineTimingBlocks();
  defineMotorBlocks();
  defineIotBlocks();
  defineDisplayBlocks();
  defineNetlogicBlocks();
}
