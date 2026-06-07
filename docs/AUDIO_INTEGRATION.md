# Интеграция аудио-плеера

## Обзор

Приложение использует **react-native-track-player** для воспроизведения аудио. Интеграция состоит из нескольких слоёв:

1. **audioPlayerService** - низкоуровневый сервис для работы с TrackPlayer
2. **playerStore** (Zustand) - state management с интеграцией audioPlayerService
3. **useTrackPlayer** - хук для автоматической синхронизации
4. **trackPlayerService** - обработчик фоновых событий

## Архитектура

```
┌─────────────────────────────────────────┐
│          React Components               │
│  (LibraryScreen, PlayerControls, etc.)  │
└──────────────┬──────────────────────────┘
               │ usePlayerStore()
               ↓
┌─────────────────────────────────────────┐
│          playerStore (Zustand)          │
│     State + Actions + audioPlayer       │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│        audioPlayerService               │
│   Обертка над react-native-track-player │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│      React Native Track Player          │
│    Нативный аудио-движок (iOS/Android)  │
└─────────────────────────────────────────┘
```

## Компоненты

### 1. audioPlayerService

**Файл:** `src/shared/services/audioPlayer.ts`

Низкоуровневый singleton-сервис для работы с TrackPlayer.

**Основные методы:**
- `initialize()` - инициализация плеера
- `setQueue(tracks)` - установка очереди
- `play()`, `pause()`, `stop()` - управление воспроизведением
- `skipToNext()`, `skipToPrevious()` - навигация по трекам
- `seekTo(position)` - перемотка
- `setVolume(volume)` - громкость
- `setRepeatMode(mode)` - режим повтора

**Пример использования:**
```typescript
import { audioPlayerService } from '@/shared/services/audioPlayer';

// Инициализация (вызывается автоматически в App.tsx)
await audioPlayerService.initialize();

// Установка очереди и воспроизведение
await audioPlayerService.setQueue(tracks);
await audioPlayerService.play();
```

### 2. playerStore

**Файл:** `src/features/player/store/playerStore.ts`

Zustand store, интегрированный с audioPlayerService. Все методы асинхронные и автоматически вызывают соответствующие методы audioPlayerService.

**Состояние:**
```typescript
{
  currentTrack: Track | null,
  isPlaying: boolean,
  position: number,        // текущая позиция в секундах
  duration: number,        // длительность в секундах
  buffering: boolean,
  repeatMode: 'off' | 'one' | 'all',
  shuffleEnabled: boolean,
  volume: number,          // 0-1
  queue: Track[],
  currentIndex: number,
}
```

**Действия:**
- `setTrack(track)` - установить один трек
- `setQueue(tracks, startIndex?)` - установить очередь
- `play()`, `pause()`, `togglePlay()` - управление
- `next()`, `previous()` - навигация
- `seek(position)` - перемотка
- `setVolume(volume)` - громкость
- `setRepeatMode(mode)` - repeat mode

**Пример использования в компоненте:**
```typescript
import { usePlayerStore } from '@/features/player/store';

function MyComponent() {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    play,
    pause,
    next,
  } = usePlayerStore();

  return (
    <View>
      <Text>{currentTrack?.title}</Text>
      <Text>{position} / {duration}</Text>
      <Button onPress={play}>Play</Button>
      <Button onPress={pause}>Pause</Button>
      <Button onPress={next}>Next</Button>
    </View>
  );
}
```

### 3. useTrackPlayer

**Файл:** `src/shared/hooks/useTrackPlayer.ts`

Хук, который автоматически синхронизирует TrackPlayer с Zustand store. Подписывается на события TrackPlayer и обновляет store.

**События, на которые подписан:**
- `PlaybackProgressUpdated` → обновляет position и duration
- `PlaybackState` → обновляет isPlaying и buffering
- `PlaybackActiveTrackChanged` → при смене трека через уведомления
- `PlaybackQueueEnded` → при окончании очереди

**Использование:**
```typescript
// В App.tsx (уже добавлено)
import { useTrackPlayer } from '@/shared/hooks/useTrackPlayer';

function AppContent() {
  useTrackPlayer(); // Просто вызываем хук
  return <RootNavigator />;
}
```

### 4. trackPlayerService

**Файл:** `src/shared/services/trackPlayerService.ts`

Обработчик фоновых событий (remote controls). Регистрируется в `index.js`.

**Обрабатывает:**
- Remote Play/Pause
- Remote Next/Previous
- Remote Seek
- Remote Stop

**Регистрация:**
```javascript
// В index.js (уже добавлено)
import TrackPlayer from 'react-native-track-player';
import { trackPlayerService } from './src/shared/services/trackPlayerService';

TrackPlayer.registerPlaybackService(() => trackPlayerService);
```

## Медиатека

### mediaLibraryService

**Файл:** `src/shared/services/mediaLibrary.ts`

Сервис для сканирования аудио-файлов на устройстве.

**Методы:**
- `scanMediaLibrary()` - сканирование всех музыкальных директорий
- `searchTracks(tracks, query)` - поиск по треками
- `groupByAlbum(tracks)` - группировка по альбомам
- `groupByArtist(tracks)` - группировка по исполнителям

**Поддерживаемые форматы:**
- mp3, flac, aac, wav, ogg, m4a

**Директории сканирования:**
- **Android:** `/storage/emulated/0/Music`, `/storage/emulated/0/Download`
- **iOS:** Documents, Main Bundle

**Пример:**
```typescript
import { mediaLibraryService } from '@/shared/services/mediaLibrary';

const tracks = await mediaLibraryService.scanMediaLibrary();
console.log(`Found ${tracks.length} tracks`);

const filtered = mediaLibraryService.searchTracks(tracks, 'Queen');
const albumMap = mediaLibraryService.groupByAlbum(tracks);
```

### useMediaPermissions

**Файл:** `src/shared/hooks/useMediaPermissions.ts`

Хук для запроса и проверки разрешений на доступ к медиатеке.

**Возвращает:**
```typescript
{
  hasPermission: boolean,    // есть ли разрешение
  isChecking: boolean,       // идёт ли проверка
  checkPermission: () => Promise<boolean>,
  requestPermission: () => Promise<boolean>,
}
```

**Разрешения:**
- **Android 13+:** `READ_MEDIA_AUDIO`
- **Android < 13:** `READ_EXTERNAL_STORAGE`
- **iOS:** `MEDIA_LIBRARY`

**Пример:**
```typescript
import { useMediaPermissions } from '@/shared/hooks/useMediaPermissions';

function LibraryScreen() {
  const { hasPermission, isChecking, requestPermission } = useMediaPermissions();

  if (isChecking) {
    return <Loading />;
  }

  if (!hasPermission) {
    return <Button onPress={requestPermission}>Grant Permission</Button>;
  }

  return <TrackList />;
}
```

## Инициализация

### App.tsx

```typescript
import { audioPlayerService } from '@/shared/services/audioPlayer';
import { useTrackPlayer } from '@/shared/hooks/useTrackPlayer';

function AppContent() {
  // Синхронизация TrackPlayer со store
  useTrackPlayer();
  return <RootNavigator />;
}

function App() {
  useEffect(() => {
    // Инициализация при запуске
    audioPlayerService.initialize().catch(console.error);

    return () => {
      // Очистка при размонтировании
      audioPlayerService.destroy().catch(console.error);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

### index.js

```javascript
import TrackPlayer from 'react-native-track-player';
import { trackPlayerService } from './src/shared/services/trackPlayerService';

// Регистрация сервиса для фоновой работы
TrackPlayer.registerPlaybackService(() => trackPlayerService);
```

## Типичные сценарии использования

### 1. Воспроизведение трека из списка

```typescript
function TrackList({ tracks }: { tracks: Track[] }) {
  const { setQueue } = usePlayerStore();

  const handleTrackPress = (track: Track, index: number) => {
    // Устанавливаем очередь и начинаем воспроизведение с выбранного трека
    setQueue(tracks, index);
  };

  return (
    <FlatList
      data={tracks}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => handleTrackPress(item, index)}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
```

### 2. Элементы управления плеером

```typescript
function PlayerControls() {
  const {
    isPlaying,
    togglePlay,
    next,
    previous,
    repeatMode,
    setRepeatMode,
  } = usePlayerStore();

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  return (
    <View>
      <Button onPress={previous}>⏮</Button>
      <Button onPress={togglePlay}>{isPlaying ? '⏸' : '▶'}</Button>
      <Button onPress={next}>⏭</Button>
      <Button onPress={cycleRepeatMode}>🔁 {repeatMode}</Button>
    </View>
  );
}
```

### 3. Прогресс-бар с перемоткой

```typescript
function ProgressBar() {
  const { position, duration, seek } = usePlayerStore();

  const handleSeek = (value: number) => {
    seek(value);
  };

  return (
    <View>
      <Text>{formatTime(position)} / {formatTime(duration)}</Text>
      <Slider
        value={position}
        minimumValue={0}
        maximumValue={duration}
        onSlidingComplete={handleSeek}
      />
    </View>
  );
}
```

### 4. Сканирование библиотеки

```typescript
function LibraryScreen() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { hasPermission, requestPermission } = useMediaPermissions();

  const scanLibrary = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    setLoading(true);
    try {
      const scanned = await mediaLibraryService.scanMediaLibrary();
      setTracks(scanned);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission) {
      scanLibrary();
    }
  }, [hasPermission]);

  return loading ? <Loading /> : <TrackList tracks={tracks} />;
}
```

## Отладка

### Проверка состояния TrackPlayer

```typescript
import TrackPlayer from 'react-native-track-player';

const checkPlayerState = async () => {
  const state = await TrackPlayer.getState();
  const position = await TrackPlayer.getPosition();
  const duration = await TrackPlayer.getDuration();
  const queue = await TrackPlayer.getQueue();

  console.log({ state, position, duration, queueLength: queue.length });
};
```

### Логирование событий

```typescript
// В useTrackPlayer.ts уже добавлены console.log для отладки
// Смотрите логи Metro bundler при воспроизведении
```

## Известные ограничения

1. **Парсинг метаданных** - сейчас используется простой парсинг имён файлов. Для полноценной поддержки ID3 tags нужна дополнительная библиотека.

2. **Обложки альбомов** - извлекаются из файлов только если прописаны в метаданных. Для чтения embedded artwork нужна библиотека ID3.

3. **Shuffle** - логика перемешивания очереди требует доработки.

4. **iOS Background Mode** - требуется настройка в Xcode для фонового воспроизведения.

## Следующие шаги

1. Добавить библиотеку для ID3 tags (например, `react-native-track-player` имеет встроенную поддержку)
2. Реализовать shuffle логику
3. Добавить сохранение очереди воспроизведения в MMKV
4. Настроить iOS background modes
5. Добавить визуализацию аудио (waveform, spectrum)
