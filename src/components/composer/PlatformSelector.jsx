import React from 'react';

const platforms = [
  { id: 'instagram', label: 'Instagram', color: 'bg-orange-500' },
  { id: 'tiktok', label: 'TikTok', color: 'bg-purple-400' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-500' },
  { id: 'x', label: 'X', color: 'bg-gray-500' },
];

export default function PlatformSelector({ selected, setSelected }) {
  const toggle = (id) => {
    setSelected(
      selected.includes(id)
        ? selected.filter(p => p !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Platforms</label>
      <div className="flex flex-wrap gap-2">
        {platforms.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => toggle(p.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
              selected.includes(p.id)
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border text-muted-foreground hover:border-border/80'
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}