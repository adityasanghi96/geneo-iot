import type { SimulatorComponent } from '../../types';
import { useAppSelector } from '../../store/hooks';

interface Props {
  component: SimulatorComponent;
}

export default function LEDWidget({ component }: Props) {
  const pinState = useAppSelector((s) => s.simulator.pinStates[component.pin] ?? 0);
  const isOn = pinState === 1;

  const colorMap: Record<string, { on: string; off: string; glow: string }> = {
    'led-builtin': { on: '#22c55e', off: '#15803d', glow: '#22c55e' },
    'led-13': { on: '#ef4444', off: '#991b1b', glow: '#ef4444' },
  };
  const colors = colorMap[component.id] ?? { on: '#f59e0b', off: '#92400e', glow: '#f59e0b' };

  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[#2a2a2a] border border-[#3c3c3c]">
      <div className="relative flex items-center justify-center">
        <div
          className={`w-8 h-8 rounded-full transition-all duration-200 ${isOn ? 'led-on' : ''}`}
          style={{
            backgroundColor: isOn ? colors.on : colors.off,
            color: colors.glow,
            boxShadow: isOn ? `0 0 12px 4px ${colors.glow}55` : 'none',
          }}
        />
        <div
          className="absolute w-3 h-3 rounded-full opacity-60"
          style={{ backgroundColor: isOn ? '#fff' : 'transparent', top: '4px', left: '4px' }}
        />
      </div>
      <span className="text-[10px] text-gray-400">{component.label}</span>
      <span
        className={`text-[10px] font-mono font-bold ${isOn ? 'text-green-400' : 'text-gray-600'}`}
      >
        PIN {component.pin} — {isOn ? 'HIGH' : 'LOW'}
      </span>
    </div>
  );
}
