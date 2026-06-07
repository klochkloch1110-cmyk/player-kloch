import { useEffect } from 'react';
import TrackPlayer, { Event, State, useTrackPlayerEvents } from 'react-native-track-player';
import { usePlayerStore } from '../../features/player/store';

/**
 * Хук для синхронизации TrackPlayer с Zustand store
 */
export function useTrackPlayer() {
  const {
    setPosition,
    setDuration,
    setBuffering,
    play: storePlay,
    pause: storePause,
    next,
    previous,
  } = usePlayerStore();

  // Подписка на события изменения позиции
  useTrackPlayerEvents([Event.PlaybackProgressUpdated], async (event) => {
    if (event.type === Event.PlaybackProgressUpdated) {
      setPosition(event.position);
      setDuration(event.duration);
    }
  });

  // Подписка на события изменения состояния
  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      const { state } = event;
      
      if (state === State.Playing) {
        storePlay();
      } else if (state === State.Paused || state === State.Ready) {
        storePause();
      } else if (state === State.Buffering || state === State.Loading) {
        setBuffering(true);
      } else {
        setBuffering(false);
      }
    }
  });

  // Подписка на события смены трека
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    if (event.type === Event.PlaybackActiveTrackChanged) {
      const { index } = event;
      if (index !== undefined && index !== null) {
        // Трек изменился через TrackPlayer (например, через уведомление)
        // Store обновится через другие события
      }
    }
  });

  // Подписка на окончание трека
  useTrackPlayerEvents([Event.PlaybackQueueEnded], async (event) => {
    if (event.type === Event.PlaybackQueueEnded) {
      const { position, track } = event;
      // Очередь закончилась
      storePause();
    }
  });

  // Инициализация при монтировании
  useEffect(() => {
    // Синхронизация начального состояния
    const syncInitialState = async () => {
      try {
        const position = await TrackPlayer.getPosition();
        const duration = await TrackPlayer.getDuration();
        const state = await TrackPlayer.getState();

        setPosition(position);
        setDuration(duration);

        if (state === State.Playing) {
          storePlay();
        } else {
          storePause();
        }
      } catch (error) {
        console.error('Failed to sync initial state:', error);
      }
    };

    syncInitialState();
  }, []);

  return {
    // Хук может возвращать дополнительные утилиты если нужно
  };
}
