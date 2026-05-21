'use client';

import { useEffect, useRef } from 'react';

interface Props {
  analyserRef: React.RefObject<AnalyserNode | null>;
  isPlaying: boolean;
  accentColor: string;
}

export function SpectrumVisualizer({ analyserRef, isPlaying, accentColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const BAR_COUNT = 40;
    let animId: number;

    const drawIdle = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barW = Math.floor((canvas.width - BAR_COUNT) / BAR_COUNT);
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < BAR_COUNT; i++) {
        ctx.fillRect(i * (barW + 1), canvas.height - 3, barW, 3);
      }
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      animId = requestAnimationFrame(draw);
      const analyser = analyserRef.current;
      if (!analyser) { drawIdle(); return; }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const count = Math.min(BAR_COUNT, bufferLength);
      const barW = Math.floor((canvas.width - count) / count);

      for (let i = 0; i < count; i++) {
        const value = dataArray[i] / 255;
        const barH = Math.max(3, value * canvas.height);
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.25 + value * 0.75;
        ctx.fillRect(i * (barW + 1), canvas.height - barH, barW, barH);
      }
      ctx.globalAlpha = 1;
    };

    if (isPlaying) {
      draw();
    } else {
      drawIdle();
    }

    return () => cancelAnimationFrame(animId);
    // analyserRef is a stable ref — no need to include it as dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, accentColor]);

  return <canvas ref={canvasRef} width={400} height={72} className="w-full h-[72px] rounded" />;
}
