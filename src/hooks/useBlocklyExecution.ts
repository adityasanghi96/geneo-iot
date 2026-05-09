import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setRunning } from '../store/slices/simulatorSlice';
import { BlockExecutor } from '../runtime/executor';

/**
 * Watches the simulator `running` flag and drives the BlockExecutor.
 * Pass a getter that returns the current Blockly workspace instance.
 */
export function useBlocklyExecution(getWorkspace: () => Blockly.Workspace | null) {
  const dispatch = useAppDispatch();
  const running = useAppSelector((s) => s.simulator.running);
  const executorRef = useRef<BlockExecutor | null>(null);

  useEffect(() => {
    if (running) {
      const ws = getWorkspace();
      if (!ws) {
        dispatch(setRunning(false));
        return;
      }
      const executor = new BlockExecutor(dispatch);
      executorRef.current = executor;
      executor.run(ws);
    } else {
      executorRef.current?.abort();
      executorRef.current = null;
    }
  }, [running]);
}
