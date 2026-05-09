import { useAppSelector } from '../../store/hooks';
import type { SimulatorComponent } from '../../types';

interface Props {
  component: SimulatorComponent;
}

export default function BuzzerWidget({ component }: Props) {
  const pinState = useAppSelector((s) => s.simulator.pinStates[component.pin] ?? 0);
  const isOn = pinState === 1;

  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[#2a2a2a] border border-[#3c3c3c]">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-100 ${
          isOn ? 'buzzer-on border-orange-400 bg-orange-900' : 'border-gray-600 bg-[#333]'
        }`}
      >
        <BuzzerIcon active={isOn} />
      </div>
      <span className="text-[10px] text-gray-400">{component.label}</span>
      <span className={`text-[10px] font-mono ${isOn ? 'text-orange-400' : 'text-gray-600'}`}>
        PIN {component.pin} — {isOn ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}

function BuzzerIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#fb923c' : '#6b7280'} strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {active && (
        <>
          <path d="M15.54 8.46a5 5 0 010 7.07" />
          <path d="M19.07 4.93a10 10 0 010 14.14" />
        </>
      )}
    </svg>
  );
}
