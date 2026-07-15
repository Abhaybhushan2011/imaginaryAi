import { Send, Download, RotateCcw, Loader2 } from 'lucide-react';

export default function PromptBar({
  prompt,
  setPrompt,
  isLoading,
  generatedImage,
  onGenerate,
  onDownload,
  onReset,
}) {
  const canGenerate = prompt.trim().length > 0 && !isLoading;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && canGenerate) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-4 pt-6 bg-gradient-to-t from-deep via-deep/95 to-transparent pointer-events-none">
      <div className="max-w-2xl mx-auto px-4 pointer-events-auto">
        <div className="glass-panel rounded-2xl p-1.5 neon-glow transition-shadow duration-300 focus-within:shadow-[0_0_25px_rgba(168,85,247,0.4)]">
          <div className="flex items-center gap-2">
            {/* Reset Button */}
            {generatedImage && !isLoading && (
              <button
                onClick={onReset}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all interactive-scale"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Input */}
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the image you want to create…"
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm px-3 py-2.5 outline-none min-w-0"
              disabled={isLoading}
            />

            {/* Download Button */}
            {generatedImage && !isLoading && (
              <button
                onClick={onDownload}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan transition-all interactive-scale"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Generate Button */}
            <button
              onClick={onGenerate}
              disabled={!canGenerate}
              className={`flex-shrink-0 h-10 px-5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200 interactive-scale ${
                canGenerate
                  ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white neon-glow hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Creating…</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-[11px] text-gray-600 mt-2">
          Powered by Stable Diffusion XL · Press Enter to generate
        </p>
      </div>
    </div>
  );
}
