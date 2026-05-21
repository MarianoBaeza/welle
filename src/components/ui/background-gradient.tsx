'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

interface AccentEntry {
  id: string;
  color: string;
}

interface AccentGlowProps {
  color: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
}

function AccentGlow({ color, x, y, visible }: AccentGlowProps) {
  const bg = useTransform(() =>
    `radial-gradient(circle 650px at ${x.get()}% ${y.get()}%, ${color}55, transparent)`
  );
  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: bg }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.7 }}
    />
  );
}

interface Props {
  hoveredId: string | null;
  accents: AccentEntry[];
}

export function BackgroundGradient({ hoveredId, accents }: Props) {
  const rawX = useMotionValue(50);
  const rawY = useMotionValue(30);
  const x = useSpring(rawX, { stiffness: 70, damping: 28 });
  const y = useSpring(rawY, { stiffness: 70, damping: 28 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 100);
      rawY.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [rawX, rawY]);

  const baseBg = useTransform(() =>
    `radial-gradient(circle 560px at ${x.get()}% ${y.get()}%, #52525255, transparent)`
  );

  return (
    <div className="fixed inset-0 -z-10 bg-zinc-950">
      <motion.div className="absolute inset-0" style={{ background: baseBg }} />
      {accents.map(({ id, color }) => (
        <AccentGlow
          key={id}
          color={color}
          x={x}
          y={y}
          visible={hoveredId === id}
        />
      ))}
    </div>
  );
}
