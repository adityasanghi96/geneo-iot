import { useState } from 'react';

interface Category {
  name: string;
  color: string;
  expandable?: boolean;
}

const CATEGORIES: Category[] = [
  { name: 'NetLogic', color: '#7c3aed' },
  { name: 'Motors', color: '#0f766e' },
  { name: 'IOT', color: '#0e7490' },
  { name: 'Display', color: '#0369a1' },
  { name: 'Logic', color: '#0d9488' },
  { name: 'Loops', color: '#16a34a' },
  { name: 'Math', color: '#0891b2' },
  { name: 'Text', color: '#dc2626' },
  { name: 'Lists', color: '#991b1b' },
  { name: 'Variables', color: '#7c3aed' },
  { name: 'Functions', color: '#4338ca' },
  { name: 'Timing', color: '#0f766e' },
  { name: 'Machine', color: '#374151', expandable: true },
  { name: 'Files', color: '#1f2937' },
  { name: 'Network and Internet', color: '#111827', expandable: true },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="flex flex-col w-[84px] bg-gray-50 border-r border-gray-200 shrink-0 overflow-y-auto">
      {CATEGORIES.map((cat) => (
        <div key={cat.name}>
          <button
            onClick={() => cat.expandable && toggle(cat.name)}
            className="w-full flex items-center gap-1 px-2 py-1.5 text-white text-xs font-medium transition-opacity hover:opacity-90 leading-tight"
            style={{ backgroundColor: cat.color, minHeight: '28px' }}
            title={cat.name}
          >
            {cat.expandable && (
              <span className="text-[10px] shrink-0">
                {expanded[cat.name] ? '▼' : '▶'}
              </span>
            )}
            <span className="truncate">{cat.name}</span>
          </button>

          {cat.expandable && expanded[cat.name] && (
            <div className="border-l-2 ml-2" style={{ borderColor: cat.color }}>
              {cat.name === 'Machine' && (
                <>
                  <SubCategoryItem label="In/Out Pins" color={cat.color} />
                </>
              )}
              {cat.name === 'Network and Internet' && (
                <>
                  <SubCategoryItem label="WiFi" color={cat.color} />
                  <SubCategoryItem label="MQTT" color={cat.color} />
                  <SubCategoryItem label="HTTP" color={cat.color} />
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}

function SubCategoryItem({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="px-2 py-1 text-xs text-white"
      style={{ backgroundColor: color, opacity: 0.85 }}
    >
      {label}
    </div>
  );
}
