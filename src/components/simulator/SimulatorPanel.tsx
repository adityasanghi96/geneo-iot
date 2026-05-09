import { useAppSelector } from '../../store/hooks';
import LEDWidget from './LEDWidget';
import ButtonWidget from './ButtonWidget';
import ServoWidget from './ServoWidget';
import BuzzerWidget from './BuzzerWidget';

export default function SimulatorPanel() {
  const components = useAppSelector((s) => s.simulator.components);
  const running = useAppSelector((s) => s.simulator.running);

  const leds = components.filter((c) => c.kind === 'led');
  const buttons = components.filter((c) => c.kind === 'button');
  const servos = components.filter((c) => c.kind === 'servo');
  const buzzers = components.filter((c) => c.kind === 'buzzer');

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
        <span className="text-xs text-gray-400 font-medium">Simulator</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${running ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-[10px] text-gray-500">{running ? 'Running' : 'Idle'}</span>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* LEDs */}
        {leds.length > 0 && (
          <Section title="LEDs">
            <div className="flex flex-wrap gap-2">
              {leds.map((c) => (
                <LEDWidget key={c.id} component={c} />
              ))}
            </div>
          </Section>
        )}

        {/* Buttons */}
        {buttons.length > 0 && (
          <Section title="Buttons">
            <div className="flex flex-wrap gap-2">
              {buttons.map((c) => (
                <ButtonWidget key={c.id} component={c} />
              ))}
            </div>
          </Section>
        )}

        {/* Servos */}
        {servos.length > 0 && (
          <Section title="Servos">
            <div className="flex flex-wrap gap-2">
              {servos.map((c) => (
                <ServoWidget key={c.id} component={c} />
              ))}
            </div>
          </Section>
        )}

        {/* Buzzers */}
        {buzzers.length > 0 && (
          <Section title="Buzzers">
            <div className="flex flex-wrap gap-2">
              {buzzers.map((c) => (
                <BuzzerWidget key={c.id} component={c} />
              ))}
            </div>
          </Section>
        )}

        {/* GPIO Table */}
        <Section title="GPIO State">
          <GPIOTable />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

function GPIOTable() {
  const pinStates = useAppSelector((s) => s.simulator.pinStates);
  const pins = Object.entries(pinStates);

  if (pins.length === 0) {
    return <p className="text-xs text-gray-700 italic">No GPIO activity yet</p>;
  }

  return (
    <div className="rounded border border-[#3c3c3c] overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#2a2a2a]">
            <th className="text-left px-2 py-1 text-gray-500 font-medium">Pin</th>
            <th className="text-left px-2 py-1 text-gray-500 font-medium">State</th>
          </tr>
        </thead>
        <tbody>
          {pins.map(([pin, value]) => (
            <tr key={pin} className="border-t border-[#3c3c3c]">
              <td className="px-2 py-1 text-gray-400 font-mono">GPIO {pin}</td>
              <td className="px-2 py-1">
                <span
                  className={`inline-flex items-center gap-1 font-mono font-bold ${
                    value === 1 ? 'text-green-400' : 'text-gray-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full inline-block ${
                      value === 1 ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                  />
                  {value === 1 ? 'HIGH' : 'LOW'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
