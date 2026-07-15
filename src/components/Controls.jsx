import {
  RectangleHorizontal,
  Square,
  RectangleVertical,
  Palette,
  Camera,
  Brush,
  Clapperboard,
  Mountain,
  Gem,
  Zap,
  Flame,
  Layers,
} from 'lucide-react';

const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1', icon: Square, desc: 'Square' },
  { label: '16:9', value: '16:9', icon: RectangleHorizontal, desc: 'Landscape' },
  { label: '9:16', value: '9:16', icon: RectangleVertical, desc: 'Portrait' },
];

const STYLE_PRESETS = [
  { label: 'None', value: '', icon: Zap, color: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/20' },
  { label: 'Cinematic', value: 'cinematic lighting, dramatic', icon: Clapperboard, color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
  { label: 'Photorealistic', value: 'photorealistic, 8k, detailed', icon: Camera, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  { label: 'Oil Painting', value: 'oil painting, textured canvas', icon: Brush, color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
  { label: 'Fantasy', value: 'fantasy art, ethereal, magical', icon: Gem, color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30' },
  { label: 'Landscape', value: 'landscape photography, golden hour', icon: Mountain, color: 'from-green-500/20 to-lime-500/20', border: 'border-green-500/30' },
  { label: 'Neon Noir', value: 'neon noir, dark, glowing lights', icon: Flame, color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
  { label: 'Anime', value: 'anime style, vibrant colors', icon: Layers, color: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/30' },
];

export default function Controls({ aspectRatio, setAspectRatio, vibePreset, setVibePreset }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 space-y-5">
      {/* Aspect Ratio Section */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-neon-purple to-neon-pink" />
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aspect Ratio</h3>
        </div>
        <div className="flex gap-2">
          {ASPECT_RATIOS.map(({ label, value, icon: Icon, desc }) => {
            const active = aspectRatio === value;
            return (
              <button
                key={value}
                onClick={() => setAspectRatio(value)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 interactive-scale ${
                  active
                    ? 'bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 text-white border border-neon-purple/40 neon-glow'
                    : 'bg-card border border-border/40 text-gray-400 hover:text-gray-200 hover:border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{desc}</span>
                <span className="sm:hidden">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Style Presets Section */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-neon-pink to-neon-cyan" />
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Style Preset</h3>
          <Palette className="w-3.5 h-3.5 text-gray-600" />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
          {STYLE_PRESETS.map(({ label, value, icon: Icon, color, border: borderColor }) => {
            const active = vibePreset === value;
            return (
              <button
                key={label}
                onClick={() => setVibePreset(value)}
                className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-xs font-medium transition-all duration-200 interactive-scale ${
                  active
                    ? `bg-gradient-to-b ${color} text-white border ${borderColor} shadow-lg`
                    : 'bg-card/60 border border-border/30 text-gray-500 hover:text-gray-300 hover:border-border/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : ''}`} />
                <span className="truncate w-full text-center">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
