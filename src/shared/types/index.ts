// Общие типы для всего приложения

// Трек
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // в секундах
  filePath: string;
  coverArt?: string;
  year?: number;
  genre?: string;
  trackNumber?: number;
}

// Метаданные трека (используются для чтения ID3 тегов)
export interface TrackMetadata {
  title: string;
  artist: string;
  album: string;
  duration: number;
  year?: number;
  genre?: string;
  trackNumber?: number;
  coverArt?: string;
  // Технические метаданные
  sampleRate?: number;
  bitrate?: number;
  codec?: string;
  albumArtist?: string;
}

// Альбом
export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt?: string;
  year?: number;
  trackCount: number;
  tracks: Track[];
}

// Исполнитель
export interface Artist {
  id: string;
  name: string;
  albumCount: number;
  trackCount: number;
  coverArt?: string;
}

// Плейлист
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverArt?: string;
  tracks: Track[];
  createdAt: number;
  updatedAt: number;
}

// Эквалайзер
export interface EqualizerBand {
  frequency: number; // Hz
  gain: number; // dB (-12 to +12)
  Q: number; // Quality factor
}

export interface EqualizerPreset {
  id: string;
  name: string;
  bands: number[]; // 10 значений gain
}

export interface EqualizerState {
  enabled: boolean;
  currentPreset: string;
  bands: number[];
}

// Состояние плеера
export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number; // секунды
  duration: number; // секунды
  buffering: boolean;
  repeatMode: 'off' | 'one' | 'all';
  shuffleEnabled: boolean;
  volume: number; // 0-1
}

// Очередь воспроизведения
export interface Queue {
  tracks: Track[];
  currentIndex: number;
  originalOrder: Track[]; // для shuffle
}

// Режимы повтора и темы
export type RepeatMode = 'off' | 'one' | 'all';
export type ThemeMode = 'light' | 'dark' | 'auto';
