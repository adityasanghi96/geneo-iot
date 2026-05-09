import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPinState } from '../../store/slices/simulatorSlice';
import type { SimulatorComponent } from '../../types';

interface Props {
  component: SimulatorComponent;
}

export default function ButtonWidget({ component }: Props) {
  const dispatch = useAppDispatch();
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    dispatch(setPinState({ pin: component.pin, value: 1 }));
  };

  const handleRelease = () => {
    setPressed(false);
    dispatch(setPinState({ pin: component.pin, value: 0 }));
  };

  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[#2a2a2a] border border-[#3c3c3c]">
      <button
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        className={`w-10 h-10 rounded-full border-2 font-bold text-xs transition-all select-none ${
          pressed
            ? 'bg-blue-500 border-blue-300 scale-90 shadow-inner'
            : 'bg-[#3c3c3c] border-gray-500 hover:bg-[#4a4a4a]'
        }`}
        style={{ color: pressed ? '#fff' : '#9ca3af' }}
      >
        {pressed ? '1' : '0'}
      </button>
      <span className="text-[10px] text-gray-400">{component.label}</span>
      <span className="text-[10px] font-mono text-gray-600">PIN {component.pin}</span>
    </div>
  );
}
