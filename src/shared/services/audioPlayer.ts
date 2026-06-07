import TrackPlayer, {
  Capability,
  Event,
  State,
  RepeatMode as TPRepeatMode,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import type { Track } from '../types';
import type { RepeatMode } from '../types';

/**
 * Сервис для работы с audio player
 */
class AudioPlayerService {
  private isInitialized = false;

  /**
   * Инициализация плеера
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await TrackPlayer.setupPlayer({
        maxCacheSize: 1024 * 10, // 10MB
        autoHandleInterruptions: true,
      });

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        progressUpdateEventInterval: 1,
      });

      this.isInitialized = true;
      console.log('AudioPlayer initialized');
    } catch (error) {
      console.error('Failed to initialize AudioPlayer:', error);
      throw error;
    }
  }

  /**
   * Преобразование Track в TrackPlayer Track
   */
  private convertTrack(track: Track) {
    return {
      id: track.id,
      url: track.filePath,
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: track.coverArt,
      duration: track.duration,
    };
  }

  /**
   * Добавить треки в очередь
   */
  async setQueue(tracks: Track[]): Promise<void> {
    await this.initialize();
    const convertedTracks = tracks.map(t => this.convertTrack(t));
    await TrackPlayer.setQueue(convertedTracks);
  }

  /**
   * Добавить трек в очередь
   */
  async addTrack(track: Track): Promise<void> {
    await this.initialize();
    await TrackPlayer.add(this.convertTrack(track));
  }

  /**
   * Воспроизведение
   */
  async play(): Promise<void> {
    await this.initialize();
    await TrackPlayer.play();
  }

  /**
   * Пауза
   */
  async pause(): Promise<void> {
    await this.initialize();
    await TrackPlayer.pause();
  }

  /**
   * Остановка
   */
  async stop(): Promise<void> {
    await this.initialize();
    await TrackPlayer.stop();
  }

  /**
   * Следующий трек
   */
  async skipToNext(): Promise<void> {
    await this.initialize();
    await TrackPlayer.skipToNext();
  }

  /**
   * Предыдущий трек
   */
  async skipToPrevious(): Promise<void> {
    await this.initialize();
    await TrackPlayer.skipToPrevious();
  }

  /**
   * Перемотка на позицию
   */
  async seekTo(position: number): Promise<void> {
    await this.initialize();
    await TrackPlayer.seekTo(position);
  }

  /**
   * Установка громкости
   */
  async setVolume(volume: number): Promise<void> {
    await this.initialize();
    await TrackPlayer.setVolume(volume);
  }

  /**
   * Установка режима повтора
   */
  async setRepeatMode(mode: RepeatMode): Promise<void> {
    await this.initialize();
    const tpMode = {
      off: TPRepeatMode.Off,
      one: TPRepeatMode.Track,
      all: TPRepeatMode.Queue,
    }[mode];
    await TrackPlayer.setRepeatMode(tpMode);
  }

  /**
   * Получение текущей позиции
   */
  async getPosition(): Promise<number> {
    await this.initialize();
    return await TrackPlayer.getPosition();
  }

  /**
   * Получение длительности
   */
  async getDuration(): Promise<number> {
    await this.initialize();
    return await TrackPlayer.getDuration();
  }

  /**
   * Получение состояния плеера
   */
  async getState(): Promise<State> {
    await this.initialize();
    return await TrackPlayer.getState();
  }

  /**
   * Получение текущего трека
   */
  async getCurrentTrack(): Promise<number | undefined> {
    await this.initialize();
    return await TrackPlayer.getActiveTrackIndex();
  }

  /**
   * Очистка очереди
   */
  async reset(): Promise<void> {
    await this.initialize();
    await TrackPlayer.reset();
  }

  /**
   * Сброс сервиса (очистка очереди и остановка)
   */
  async destroy(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }
    try {
      await TrackPlayer.reset();
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to destroy player:', error);
    }
  }

  /**
   * =====================================================
   * ЭКВАЛАЙЗЕР (методы-заглушки для будущей реализации)
   * =====================================================
   * 
   * Текущая версия: UI-only эквалайзер (state management)
   * Будущая реализация: Native audio effects
   * 
   * Варианты имплементации:
   * 1. Android: android.media.audiofx.Equalizer
   * 2. iOS: AVAudioUnitEQ
   * 
   * См. docs/EQUALIZER_IMPLEMENTATION.md для деталей
   */

  /**
   * Включить/выключить эквалайзер
   * TODO: Реализовать native bridge
   */
  async setEqualizerEnabled(enabled: boolean): Promise<void> {
    await this.initialize();
    console.log(`[Equalizer] ${enabled ? 'Enabled' : 'Disabled'} (UI-only)`);
    // TODO: Native implementation
    // Android: mEqualizer.setEnabled(enabled)
    // iOS: [audioUnitEQ setBypass:!enabled]
  }

  /**
   * Установить усиление полосы эквалайзера
   * @param bandIndex - индекс полосы (0-9)
   * @param gain - усиление в дБ (-12 до +12)
   * TODO: Реализовать native bridge
   */
  async setEqualizerBandGain(bandIndex: number, gain: number): Promise<void> {
    await this.initialize();
    
    if (bandIndex < 0 || bandIndex > 9) {
      console.warn(`[Equalizer] Invalid band index: ${bandIndex}`);
      return;
    }

    const clampedGain = Math.max(-12, Math.min(12, gain));
    console.log(`[Equalizer] Band ${bandIndex}: ${clampedGain}dB (UI-only)`);
    
    // TODO: Native implementation
    // Android: mEqualizer.setBandLevel(bandIndex, (short)(gain * 100))
    // iOS: filterParameters[bandIndex].gain = gain
  }

  /**
   * Применить предустановленный пресет эквалайзера
   * @param presetId - ID пресета из equalizerStore
   * @param bands - массив значений gain для каждой полосы
   * TODO: Реализовать native bridge
   */
  async setEqualizerPreset(presetId: string, bands: number[]): Promise<void> {
    await this.initialize();
    console.log(`[Equalizer] Preset applied: ${presetId} (UI-only)`);
    
    // Применяем все полосы сразу
    for (let i = 0; i < bands.length && i < 10; i++) {
      await this.setEqualizerBandGain(i, bands[i]);
    }
  }

  /**
   * Получить доступные частоты эквалайзера (для информации)
   * Возвращает стандартные ISO частоты для 10-полосного EQ
   */
  getEqualizerBands(): Array<{ frequency: number; label: string }> {
    return [
      { frequency: 31, label: '31Hz' },
      { frequency: 63, label: '63Hz' },
      { frequency: 125, label: '125Hz' },
      { frequency: 250, label: '250Hz' },
      { frequency: 500, label: '500Hz' },
      { frequency: 1000, label: '1kHz' },
      { frequency: 2000, label: '2kHz' },
      { frequency: 4000, label: '4kHz' },
      { frequency: 8000, label: '8kHz' },
      { frequency: 16000, label: '16kHz' },
    ];
  }
}

export const audioPlayerService = new AudioPlayerService();
