import { ImageOff, Sparkles } from 'lucide-react';

const RATIO_CLASSES = {
  '1:1': 'aspect-square',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
};

export default function OutputStage({ generatedImage, isLoading, aspectRatio, runtimeError }) {
  const ratioClass = RATIO_CLASSES[aspectRatio] || 'aspect-square';

  return (
    <div className="w-full flex items-center justify-center px-4">
      <div
        className={`relative w-full max-w-2xl ${ratioClass} max-h-[65vh] rounded-2xl overflow-hidden border border-border/60 transition-all duration-500`}
        style={{ minHeight: '280px' }}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            {/* Aurora background */}
            <div className="absolute inset-0 aurora-mesh opacity-20" />
            <div className="absolute inset-0 bg-deep/60 backdrop-blur-sm" />

            {/* Spinner */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-purple border-r-neon-pink animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-neon-cyan border-l-neon-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white/90">Generating your vision</p>
                <p className="text-xs text-gray-500 mt-1">AI is painting pixels…</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {runtimeError && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-deep/80 z-10">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ImageOff className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-sm text-red-400 font-medium text-center px-6">{runtimeError}</p>
          </div>
        )}

        {/* Generated Image */}
        {generatedImage && !isLoading && !runtimeError && (
          <img
            src={generatedImage}
            alt="AI Generated"
            className="w-full h-full object-contain bg-deep/40 animate-in fade-in duration-700"
          />
        )}

        {/* Empty Placeholder */}
        {!generatedImage && !isLoading && !runtimeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(circle, #A855F7 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 border border-border/40 flex items-center justify-center animate-float">
                <Sparkles className="w-8 h-8 text-neon-purple/40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white/30">Your canvas awaits</p>
                <p className="text-xs text-gray-600 mt-1">
                  Type a prompt below to conjure an image
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Ambient border glow when image is present */}
        {generatedImage && !isLoading && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none border border-neon-purple/20" />
        )}
      </div>
    </div>
  );
}
