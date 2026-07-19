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
      // Dynamic operational route dispatcher mapping
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, aspectRatio }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server latency down: Cluster responded with ${res.status}`);
      }

      const data = await res.json();
      if (data.image) {
        setGeneratedImage(data.image);
      } else {
        throw new Error('Base64 stream allocation array crashed.');
      }
    } catch (err) {
      setRuntimeError(err.message || 'Quantum handshake timeout. Please check dashboard logs.');
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
    <div className="relative min-h-screen bg-deep overflow-hidden select-none">
      {/* Ambient background blur elements */}
      <div className="orb w-96 h-96 bg-neon-purple/20 -top-48 -left-48" />
      <div className="orb w-80 h-80 bg-neon-pink/10 top-1/3 -right-40" />
      <div className="orb w-64 h-64 bg-neon-cyan/10 bottom-20 left-1/4" />

      <Header />

      <main className="relative z-10 pt-24 pb-36 space-y-6 max-w-4xl mx-auto px-4">
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
