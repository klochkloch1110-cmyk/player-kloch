# ID3 Metadata Integration

## Обзор

Плеер поддерживает чтение метаданных из аудиофайлов с использованием библиотеки [jsmediatags](https://github.com/aadsm/jsmediatags).

## Поддерживаемые форматы

- **MP3**: ID3v1, ID3v2.2, ID3v2.3, ID3v2.4
- **MP4/M4A**: iTunes metadata
- **FLAC**: Vorbis Comments
- **WAV**: RIFF INFO

## Извлекаемые метаданные

| Поле | Тип | Описание |
|------|-----|----------|
| `title` | string | Название трека |
| `artist` | string | Исполнитель |
| `album` | string | Альбом |
| `year` | number? | Год выпуска |
| `genre` | string? | Жанр |
| `trackNumber` | number? | Номер трека в альбоме |
| `coverArt` | string? | Embedded обложка (base64 data URI) |

## Архитектура

### MetadataService

Основной сервис для работы с метаданными.

#### Методы:

**`readMetadata(filePath: string): Promise<TrackMetadata>`**
- Читает метаданные из одного файла
- При ошибке чтения ID3 возвращает fallback на основе имени файла
- Пример:
```typescript
const metadata = await metadataService.readMetadata('/path/to/song.mp3');
console.log(metadata.title, metadata.artist);
```

**`readBulkMetadata(filePaths: string[]): Promise<TrackMetadata[]>`**
- Массовое чтение метаданных из списка файлов
- Выполняется параллельно для повышения производительности

**`enhanceTrack(track: Track): Promise<Track>`**
- Обновляет существующий Track объект метаданными из ID3
- Сохраняет исходные данные при ошибке чтения

**`enhanceTracks(tracks: Track[]): Promise<Track[]>`**
- Массовое обновление метаданных для списка треков

**`isFormatSupported(filePath: string): boolean`**
- Проверяет, поддерживается ли формат файла

**`getFileSize(filePath: string): Promise<number>`**
- Возвращает размер файла в байтах

### Интеграция с MediaLibrary

`MediaLibraryService.createTrack()` автоматически читает ID3 метаданные при сканировании медиатеки:

```typescript
private async createTrack(filepath: string, index: number): Promise<Track> {
  // Чтение ID3 метаданных
  const metadata = await metadataService.readMetadata(filepath);
  
  // Fallback на парсинг имени файла
  const fallback = this.parseFilename(filepath);

  return {
    id: `track_${index}_${Date.now()}`,
    title: metadata.title || fallback.title,
    artist: metadata.artist || fallback.artist,
    album: metadata.album || fallback.album,
    year: metadata.year,
    genre: metadata.genre,
    trackNumber: metadata.trackNumber,
    coverArt: metadata.coverArt,
    // ...
  };
}
```

## Обложки (Cover Art)

### Формат

Embedded обложки конвертируются в base64 data URI:
```
data:image/jpeg;base64,/9j/4AAQSkZJRg...
```

### Поддерживаемые форматы изображений
- JPEG (image/jpeg)
- PNG (image/png)
- GIF (image/gif)
- BMP (image/bmp)

### Использование в UI

```tsx
{track.coverArt ? (
  <Image source={{ uri: track.coverArt }} style={styles.cover} />
) : (
  <Text>No Cover</Text>
)}
```

## Производительность

### Оптимизация

1. **Параллельное чтение**: `readBulkMetadata` использует `Promise.all`
2. **Ленивая загрузка**: Метаданные читаются только при сканировании
3. **Кэширование**: После первого чтения метаданные хранятся в Track объекте

### Рекомендации

- Для больших медиатек (>500 треков) показывайте прогресс сканирования
- Обложки увеличивают размер Track объектов — учитывайте при хранении в памяти
- Не рекомендуется вызывать `enhanceTracks` для уже загруженных треков

## Обработка ошибок

### Fallback стратегия

При ошибке чтения ID3 метаданных используется парсинг имени файла:

**Формат 1**: `Artist - Title.mp3`
```typescript
{
  title: "Title",
  artist: "Artist",
  album: "Unknown Album"
}
```

**Формат 2**: `Title.mp3`
```typescript
{
  title: "Title",
  artist: "Unknown Artist",
  album: "Unknown Album"
}
```

### Логирование

Все ошибки чтения метаданных логируются с префиксом `[MetadataService]`:
```
[MetadataService] Failed to read tags from /path/to/file.mp3: NotFound
```

## Ограничения

1. **Duration**: jsmediatags не извлекает длительность трека
   - Решение: используется react-native-track-player для получения duration
   
2. **React Native compatibility**: требуется polyfill Buffer
   - Установлено: `buffer@6.0.3`
   
3. **Большие обложки**: base64 encoding увеличивает размер на ~33%
   - Рекомендуется: кэшировать обложки отдельно для больших коллекций

## Зависимости

```json
{
  "jsmediatags": "^3.9.7",
  "buffer": "^6.0.3"
}
```

## Примеры использования

### Чтение метаданных одного файла

```typescript
import { metadataService } from '@/shared/services';

const metadata = await metadataService.readMetadata('/storage/Music/song.mp3');

console.log(`${metadata.artist} - ${metadata.title}`);
if (metadata.coverArt) {
  console.log('Cover art available');
}
```

### Обновление существующих треков

```typescript
const tracks = usePlayerStore((state) => state.queue);
const enhancedTracks = await metadataService.enhanceTracks(tracks);

// Обновить store с новыми метаданными
usePlayerStore.setState({ queue: enhancedTracks });
```

### Проверка формата файла

```typescript
if (metadataService.isFormatSupported(filePath)) {
  const metadata = await metadataService.readMetadata(filePath);
} else {
  console.warn('Unsupported format');
}
```

## Тестирование

Рекомендуется протестировать с файлами:
- ✅ MP3 с ID3v2.4 + embedded cover
- ✅ MP3 с ID3v1 (без обложки)
- ✅ M4A с iTunes tags
- ✅ Файл без метаданных (проверка fallback)
- ✅ Файл с кириллицей в названии/исполнителе
- ✅ Файл с номером трека в формате "3/12"

## Дальнейшее развитие

### Планируемые улучшения

1. **Кэширование обложек**: Сохранение обложек в файловую систему
2. **Прогресс сканирования**: Индикатор при чтении большой медиатеки
3. **Редактирование метаданных**: Запись обновленных тегов обратно в файл
4. **Дополнительные поля**: Composer, Lyrics, Album Artist, Disc Number

### Возможные расширения

- Поддержка OGG Vorbis
- Поддержка APE (Monkey's Audio)
- Извлечение битрейта и sample rate из аудио-данных
- Автоматическое скачивание обложек из интернета (Last.fm, MusicBrainz)
