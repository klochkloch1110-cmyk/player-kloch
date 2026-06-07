import { useEffect } from 'react';
import { useEqualizerStore } from '../../features/equalizer/store/equalizerStore';
import { audioPlayerService } from '../services/audioPlayer';

/**
 * Хук для синхронизации состояния эквалайзера с аудио-движком
 * 
 * Автоматически применяет настройки эквалайзера при их изменении.
 * В текущей версии (MVP) эквалайзер работает в UI-only режиме.
 * 
 * Будущая реализация будет использовать native audio effects
 * (Android Equalizer API / iOS AVAudioUnitEQ)
 * 
 * @see docs/EQUALIZER_IMPLEMENTATION.md
 */
export function useEqualizerSync() {
  const { enabled, bands, currentPreset } = useEqualizerStore();

  // Синхронизация включения/выключения
  useEffect(() => {
    audioPlayerService.setEqualizerEnabled(enabled);
  }, [enabled]);

  // Синхронизация настроек полос
  useEffect(() => {
    if (enabled) {
      bands.forEach((gain: number, index: number) => {
        audioPlayerService.setEqualizerBandGain(index, gain);
      });
    }
  }, [enabled, bands]);

  // Логирование текущего состояния (для отладки)
  useEffect(() => {
    if (__DEV__) {
      console.log('[useEqualizerSync] State changed:', {
        enabled,
        preset: currentPreset,
        bands: bands.map((gain: number, i: number) => `${i}: ${gain}dB`).join(', '),
      });
    }
  }, [enabled, bands, currentPreset]);

  return {
    isEnabled: enabled,
    currentPreset,
    bands,
  };
}
