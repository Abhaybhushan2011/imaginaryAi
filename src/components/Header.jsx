import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center neon-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent">
              Imaginary AI
            </h1>
            <p className="text-[10px] text-gray-500 -mt-0.5 font-medium tracking-widest uppercase">
              Diffusion Studio
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {['Create', 'Gallery', 'About'].map((item) => (
            <button
              key={item}
              className="px-3.5 py-1.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {item}
            </button>
          ))}
          <div className="ml-2 h-5 w-px bg-border" />
          <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-xs font-bold cursor-pointer interactive-scale">
            A
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/50 px-4 pb-4 pt-2 space-y-1 animate-in slide-in-from-top">
          {['Create', 'Gallery', 'About'].map((item) => (
            <button
              key={item}
              className="block w-full text-left px-3 py-2.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
