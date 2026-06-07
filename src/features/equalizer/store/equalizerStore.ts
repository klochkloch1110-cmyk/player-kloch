import { create } from 'zustand';
import { EqualizerBand, EqualizerPreset } from '../../../shared/types';
import { CONSTANTS } from '../../../shared/config/constants';

interface EqualizerStore {
  enabled: boolean;
  currentPreset: string;
  bands: number[]; // 10 значений gain
  presets: EqualizerPreset[];
  
  // Действия
  toggleEqualizer: () => void;
  setBandGain: (index: number, gain: number) => void;
  applyPreset: (presetId: string) => void;
  createCustomPreset: (name: string, bands: number[]) => void;
  resetToFlat: () => void;
}

// Предустановленные пресеты
const DEFAULT_PRESETS: EqualizerPreset[] = [
  {
    id: 'flat',
    name: 'Flat',
    bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: 'rock',
    name: 'Rock',
    bands: [5, 3, -2, -3, -1, 1, 4, 5, 5, 5],
  },
  {
    id: 'pop',
    name: 'Pop',
    bands: [-1, 2, 4, 4, 2, 0, -1, -1, -1, -1],
  },
  {
    id: 'jazz',
    name: 'Jazz',
    bands: [4, 3, 1, 2, -1, -1, 0, 1, 3, 4],
  },
  {
    id: 'classical',
    name: 'Classical',
    bands: [5, 4, 3, 2, -1, -1, 0, 2, 3, 4],
  },
  {
    id: 'electronic',
    name: 'Electronic',
    bands: [5, 4, 1, 0, -2, 2, 1, 2, 5, 6],
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop',
    bands: [6, 5, 1, 3, -1, -1, 1, -1, 2, 3],
  },
  {
    id: 'vocal',
    name: 'Vocal Boost',
    bands: [-2, -3, -2, 1, 4, 4, 3, 1, 0, -1],
  },
];

export const useEqualizerStore = create<EqualizerStore>((set, get) => ({
  enabled: false,
  currentPreset: 'flat',
  bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  presets: DEFAULT_PRESETS,

  // Включение/выключение эквалайзера
  toggleEqualizer: () => {
    set((state) => ({ enabled: !state.enabled }));
  },

  // Установка усиления полосы
  setBandGain: (index: number, gain: number) => {
    if (index < 0 || index >= CONSTANTS.EQUALIZER.BANDS.length) {
      return;
    }

    const clampedGain = Math.max(
      CONSTANTS.EQUALIZER.MIN_GAIN,
      Math.min(CONSTANTS.EQUALIZER.MAX_GAIN, gain)
    );

    set((state) => {
      const newBands = [...state.bands];
      newBands[index] = clampedGain;
      return {
        bands: newBands,
        currentPreset: 'custom', // Пользовательская настройка
      };
    });
  },

  // Применение пресета
  applyPreset: (presetId: string) => {
    const { presets } = get();
    const preset = presets.find((p) => p.id === presetId);
    
    if (!preset) return;

    set({
      bands: [...preset.bands],
      currentPreset: presetId,
    });
  },

  // Создание пользовательского пресета
  createCustomPreset: (name: string, bands: number[]) => {
    const newPreset: EqualizerPreset = {
      id: `custom-${Date.now()}`,
      name,
      bands: [...bands],
    };

    set((state) => ({
      presets: [...state.presets, newPreset],
      currentPreset: newPreset.id,
      bands: [...bands],
    }));
  },

  // Сброс к плоскому звуку
  resetToFlat: () => {
    set({
      bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      currentPreset: 'flat',
    });
  },
}));
