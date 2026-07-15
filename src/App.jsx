import { useState } from 'react';
import Header from './components/Header';
import OutputStage from './components/OutputStage';
import Controls from './components/Controls';
import PromptBar from './components/PromptBar';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [vibePreset, setVibePreset] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [runtimeError, setRuntimeError] = useState('');

  const dispatchGeneration = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setRuntimeError('');
    setGeneratedImage('');

    const fullPrompt = vibePreset
      ? `${prompt.trim()}, ${vibePreset}`
      : prompt.trim();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, aspectRatio }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      setGeneratedImage(data.image);
    } catch (err) {
      setRuntimeError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `imaginary-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetEnvironment = () => {
    setPrompt('');
    setGeneratedImage('');
    setRuntimeError('');
    setVibePreset('');
  };

  return (
    <div className="relative min-h-screen bg-deep overflow-hidden">
      {/* Ambient Orbs */}
      <div className="orb w-96 h-96 bg-neon-purple/30 -top-48 -left-48" />
      <div className="orb w-80 h-80 bg-neon-pink/20 top-1/3 -right-40" />
      <div className="orb w-64 h-64 bg-neon-cyan/20 bottom-20 left-1/4" />

      <Header />

      <main className="relative z-10 pt-24 pb-36 space-y-6 max-w-4xl mx-auto">
        <OutputStage
          generatedImage={generatedImage}
          isLoading={isLoading}
          aspectRatio={aspectRatio}
          runtimeError={runtimeError}
        />

        <Controls
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          vibePreset={vibePreset}
          setVibePreset={setVibePreset}
        />
      </main>

      <PromptBar
        prompt={prompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
        generatedImage={generatedImage}
        onGenerate={dispatchGeneration}
        onDownload={triggerDownload}
        onReset={resetEnvironment}
      />
    </div>
  );
}
