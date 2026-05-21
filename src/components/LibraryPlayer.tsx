'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { PreviewTrack } from '@/types';
import { SpectrumVisualizer } from './SpectrumVisualizer';

interface Props {
  tracks: PreviewTrack[];
  accentColor: string;
  soundCount: number;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function TrackButton({
  track,
  isActive,
  isPlaying,
  accentColor,
  onSelect,
}: {
  track: PreviewTrack;
  isActive: boolean;
  isPlaying: boolean;
  accentColor: string;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors w-full cursor-pointer"
      style={{
        backgroundColor: hovered ? accentColor + '28' : undefined,
        color: isActive ? accentColor : undefined,
      }}
    >
      {isActive && isPlaying ? (
        <Pause className="w-3 h-3 shrink-0" />
      ) : (
        <Play
          className="w-3 h-3 shrink-0 text-zinc-600 transition-colors"
          style={isActive ? { color: accentColor } : undefined}
        />
      )}
      <span className="text-xs truncate">{track.name}</span>
    </button>
  );
}

export function LibraryPlayer({ tracks, accentColor, soundCount }: Props) {
  const [currentTrack, setCurrentTrack] = useState<PreviewTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, PreviewTrack[]>();
    for (const track of tracks) {
      if (!map.has(track.category)) map.set(track.category, []);
      map.get(track.category)!.push(track);
    }
    return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
  }, [tracks]);

  const initAudio = () => {
    if (audioCtxRef.current || !audioRef.current) return;
    const ctx = new window.AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
  };

  const selectTrack = (track: PreviewTrack) => {
    initAudio();
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack?.file === track.file) {
      if (isPlaying) {
        audio.pause();
      } else {
        audioCtxRef.current?.resume();
        audio.play().catch(() => { });
      }
    } else {
      audio.src = track.file;
      audioCtxRef.current?.resume();
      audio.play().catch(() => { });
      setCurrentTrack(track);
      setCurrentTime(0);
      setProgress(0);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { setIsPlaying(false); setProgress(0); setCurrentTime(0); };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioCtxRef.current?.close();
    };
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !audio.duration) return;
    const rect = bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      {/* Count + demo notice */}
      <div className="flex items-baseline justify-between px-1">
        <p className="text-sm font-semibold text-white">
          {soundCount}{' '}
          <span className="font-normal text-zinc-400">sounds included</span>
        </p>
        <p className="text-[11px] text-zinc-500">
          {tracks.length} previews · demo only
        </p>
      </div>

      {/* Track list — 2 columns of categories */}
      {(() => {
        const half = Math.ceil(grouped.length / 2);
        const cols = [grouped.slice(0, half), grouped.slice(half)];
        return (
          <div className="grid grid-cols-2 gap-x-4 gap-y-0">
            {cols.map((colGroups, ci) => (
              <div key={ci} className="flex flex-col gap-3">
                {colGroups.map(({ category, items }) => (
                  <div key={category}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600 mb-1 px-1">
                      {category}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {items.map((track) => (
                        <TrackButton
                          key={track.file}
                          track={track}
                          isActive={currentTrack?.file === track.file}
                          isPlaying={isPlaying}
                          accentColor={accentColor}
                          onSelect={() => selectTrack(track)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })()}

      {/* Progress + time */}
      <div className="flex flex-col gap-1.5">
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          className="h-1 bg-zinc-700 rounded-full cursor-pointer"
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${progress * 100}%`, backgroundColor: accentColor }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-zinc-500 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{currentTrack?.name ?? 'Select a track'}</span>
          <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Spectrum visualizer */}
      <SpectrumVisualizer analyserRef={analyserRef} isPlaying={isPlaying} accentColor={accentColor} />

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} preload="none" />
    </div>
  );
}
