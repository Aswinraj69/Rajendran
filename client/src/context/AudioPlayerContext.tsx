import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AudioTrack } from "../types";
import { incrementAudioPlays } from "../api/audio";

interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  playlist: AudioTrack[];
  isExpanded: boolean;
  playTrack: (track: AudioTrack, newPlaylist?: AudioTrack[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setSpeed: (rate: number) => void;
  toggleExpand: () => void;
  setIsExpanded: (expanded: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize HTMLAudioElement instance
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto play next track in playlist
      if (playlist.length > 0) {
        nextTrack();
      }
    };

    const handleError = (e: Event) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, []);

  // Handle play track
  const playTrack = (track: AudioTrack, newPlaylist?: AudioTrack[]) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (newPlaylist && newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
    }

    if (currentTrack?._id === track._id) {
      // Toggle play/pause if same track
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    audio.src = track.audioUrl.startsWith("http")
      ? track.audioUrl
      : `${window.location.origin}${track.audioUrl}`;

    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackRate;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        // Increment play count in database
        if (track._id) {
          incrementAudioPlays(track._id).catch(() => {});
        }
      })
      .catch((err) => {
        console.error("Failed to play audio track:", err);
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.9;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const setSpeed = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const nextTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((t) => t._id === currentTrack._id);
    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
      playTrack(playlist[currentIndex + 1]);
    } else if (playlist.length > 0) {
      playTrack(playlist[0]);
    }
  };

  const prevTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((t) => t._id === currentTrack._id);
    if (currentIndex > 0) {
      playTrack(playlist[currentIndex - 1]);
    } else if (playlist.length > 0) {
      playTrack(playlist[playlist.length - 1]);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setIsExpanded(false);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackRate,
        playlist,
        isExpanded,
        playTrack,
        togglePlay,
        pause,
        resume,
        seek,
        setVolume,
        toggleMute,
        setSpeed,
        toggleExpand,
        setIsExpanded,
        nextTrack,
        prevTrack,
        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
