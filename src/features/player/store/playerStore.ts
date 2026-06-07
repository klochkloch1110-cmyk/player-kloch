import { create } from 'zustand';
import type { Track, PlayerState, RepeatMode } from '../../../shared/types';
import { audioPlayerService } from '../../../shared/services/audioPlayer';

interface PlayerStore extends PlayerState {
  queue: Track[];
  currentIndex: number;
  
  // Действия
  setTrack: (track: Track) => Promise<void>;
  setQueue: (tracks: Track[], startIndex?: number) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlay: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setBuffering: (buffering: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Начальное состояние
  currentTrack: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  buffering: false,
  repeatMode: 'off',
  shuffleEnabled: false,
  volume: 1,
  queue: [],
  currentIndex: -1,

  // Установка трека
  setTrack: async (track: Track) => {
    try {
      await audioPlayerService.setQueue([track]);
      set({
        currentTrack: track,
        queue: [track],
        currentIndex: 0,
        position: 0,
        duration: track.duration,
      });
      await audioPlayerService.play();
    } catch (error) {
      console.error('Failed to set track:', error);
    }
  },

  // Установка очереди
  setQueue: async (tracks: Track[], startIndex = 0) => {
    try {
      await audioPlayerService.setQueue(tracks);
      set({
        queue: tracks,
        currentIndex: startIndex,
        currentTrack: tracks[startIndex] || null,
        position: 0,
      });
      
      // Если startIndex не 0, пропускаем к нужному треку
      if (startIndex > 0) {
        for (let i = 0; i < startIndex; i++) {
          await audioPlayerService.skipToNext();
        }
      }
      
      await audioPlayerService.play();
    } catch (error) {
      console.error('Failed to set queue:', error);
    }
  },

  // Воспроизведение
  play: async () => {
    try {
      await audioPlayerService.play();
      set({ isPlaying: true });
    } catch (error) {
      console.error('Failed to play:', error);
    }
  },

  // Пауза
  pause: async () => {
    try {
      await audioPlayerService.pause();
      set({ isPlaying: false });
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  },

  // Переключение play/pause
  togglePlay: async () => {
    const { isPlaying } = get();
    if (isPlaying) {
      await get().pause();
    } else {
      await get().play();
    }
  },

  // Следующий трек
  next: async () => {
    const { queue, currentIndex, repeatMode } = get();
    
    if (queue.length === 0) return;

    try {
      await audioPlayerService.skipToNext();
      
      let nextIndex = currentIndex + 1;

      // Если достигли конца
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0; // Начать сначала
        } else {
          set({ isPlaying: false });
          return;
        }
      }

      set({
        currentIndex: nextIndex,
        currentTrack: queue[nextIndex],
        position: 0,
        duration: queue[nextIndex].duration,
      });
    } catch (error) {
      console.error('Failed to skip to next:', error);
    }
  },

  // Предыдущий трек
  previous: async () => {
    const { queue, currentIndex, position } = get();
    
    if (queue.length === 0) return;

    try {
      // Если прошло больше 3 секунд, перемотать на начало
      if (position > 3) {
        await audioPlayerService.seekTo(0);
        set({ position: 0 });
        return;
      }

      await audioPlayerService.skipToPrevious();

      let prevIndex = currentIndex - 1;

      // Если на первом треке
      if (prevIndex < 0) {
        prevIndex = queue.length - 1;
      }

      set({
        currentIndex: prevIndex,
        currentTrack: queue[prevIndex],
        position: 0,
        duration: queue[prevIndex].duration,
      });
    } catch (error) {
      console.error('Failed to skip to previous:', error);
    }
  },

  // Перемотка
  seek: async (position: number) => {
    const { duration } = get();
    const newPosition = Math.max(0, Math.min(position, duration));
    
    try {
      await audioPlayerService.seekTo(newPosition);
      set({ position: newPosition });
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  },

  // Установка текущей позиции (от плеера)
  setPosition: (position: number) => {
    set({ position });
  },

  // Установка длительности
  setDuration: (duration: number) => {
    set({ duration });
  },

  // Переключение shuffle
  toggleShuffle: () => {
    set((state) => ({ shuffleEnabled: !state.shuffleEnabled }));
    // TODO: перемешать очередь
  },

  // Установка режима повтора
  setRepeatMode: async (mode: RepeatMode) => {
    try {
      await audioPlayerService.setRepeatMode(mode);
      set({ repeatMode: mode });
    } catch (error) {
      console.error('Failed to set repeat mode:', error);
    }
  },

  // Установка громкости
  setVolume: async (volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    
    try {
      await audioPlayerService.setVolume(newVolume);
      set({ volume: newVolume });
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  },

  // Установка состояния буферизации
  setBuffering: (buffering: boolean) => {
    set({ buffering });
  },
}));
