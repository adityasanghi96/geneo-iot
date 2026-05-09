import { useAppSelector } from '../../store/hooks';
import type { SimulatorComponent } from '../../types';

interface Props {
  component: SimulatorComponent;
}

export default function ServoWidget({ component }: Props) {
  const angle = useAppSelector((s) => s.simulator.servoAngles[component.pin] ?? 0);

  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[#2a2a2a] border border-[#3c3c3c]">
      {/* Servo body + arm */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="w-8 h-8 rounded bg-gray-600 border border-gray-500 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gray-400 border border-gray-300" />
        </div>
        {/* Arm */}
        <div
          className="absolute w-0.5 h-6 bg-yellow-400 origin-bottom rounded transition-transform duration-300"
          style={{
            bottom: '50%',
            left: 'calc(50% - 1px)',
            transform: `rotate(${angle - 90}deg)`,
          }}
        />
      </div>
      <span className="text-[10px] text-gray-400">{component.label}</span>
      <span className="text-[10px] font-mono text-yellow-500">{angle}°</span>
    </div>
  );
}
