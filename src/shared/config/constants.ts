// Константы приложения
export const CONSTANTS = {
  // Аудио
  AUDIO: {
    SAMPLE_RATES: [44100, 48000, 96000, 192000],
    SUPPORTED_FORMATS: ['mp3', 'flac', 'aac', 'wav', 'ogg', 'm4a'],
    MAX_PLAYLIST_SIZE: 1000,
  },
  
  // Эквалайзер
  EQUALIZER: {
    BANDS: [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
    MIN_GAIN: -12,
    MAX_GAIN: 12,
    DEFAULT_Q: 1.0,
  },
  
  // UI
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 150,
    HAPTIC_ENABLED: true,
  },
  
  // Хранилище
  STORAGE_KEYS: {
    THEME: 'app_theme',
    EQUALIZER_PRESET: 'equalizer_preset',
    EQUALIZER_BANDS: 'equalizer_bands',
    LAST_PLAYED: 'last_played_track',
    REPEAT_MODE: 'repeat_mode',
    SHUFFLE_ENABLED: 'shuffle_enabled',
    PLAYLISTS: 'playlists',
  },
} as const;

export type RepeatMode = 'off' | 'one' | 'all';
export type ThemeMode = 'light' | 'dark' | 'auto';
