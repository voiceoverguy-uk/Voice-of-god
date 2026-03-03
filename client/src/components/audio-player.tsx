import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  title: string;
  src?: string;
  subtitle?: string;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ title, src, subtitle }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, src]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const bar = progressBarRef.current;
      if (!audio || !bar || !duration) return;

      const rect = bar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      audio.currentTime = pct * duration;
    },
    [duration]
  );

  const hasSource = !!src;

  return (
    <div
      className="group relative rounded-md bg-gray-950 p-5 transition-all duration-300"
      data-testid={`audio-player-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {src && <audio ref={audioRef} src={src} preload="metadata" />}

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={!hasSource}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            hasSource
              ? "bg-[#9C060B] hover:bg-[#7E0408] text-white cursor-pointer"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
          data-testid={`button-play-${title.toLowerCase().replace(/\s+/g, "-")}`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-white truncate">
                {title}
              </h4>
              {subtitle && (
                <p className="text-xs text-gray-400 truncate">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              {hasSource && (
                <button
                  onClick={toggleMute}
                  className="text-gray-400 transition-colors cursor-pointer"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  data-testid={`button-mute-${title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className={`relative h-1.5 rounded-full bg-gray-700 ${
              hasSource ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            data-testid={`progress-${title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#9C060B] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            {hasSource && progress > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-md transition-all duration-100"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            )}
          </div>

          {!hasSource && (
            <p className="text-xs text-gray-500 mt-2 italic">
              Audio demo coming soon
            </p>
          )}
        </div>
      </div>
    </div>
  );
}