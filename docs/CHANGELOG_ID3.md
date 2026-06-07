# Changelog: ID3 Metadata Integration

**Дата:** 2026-06-07  
**Прогресс:** 72% → 76% (+4%)

## 🎯 Цель итерации
Добавить поддержку чтения ID3 метаданных из аудиофайлов вместо парсинга имен файлов.

## ✅ Выполнено

### 1. Установлены зависимости
- `jsmediatags@3.9.7` — библиотека для чтения ID3 тегов
- `buffer@6.0.3` — polyfill для base64 encoding в React Native

### 2. Создан MetadataService (`src/shared/services/metadataService.ts`)
**Функционал:**
- `readMetadata()` — чтение метаданных из одного файла
- `readBulkMetadata()` — массовое чтение с параллелизмом
- `enhanceTrack()` / `enhanceTracks()` — обновление существующих треков
- `extractCoverArt()` — извлечение embedded обложек в base64 data URI
- Fallback на парсинг имени файла при ошибке чтения ID3

**Поддерживаемые форматы:**
- MP3 (ID3v1, ID3v2.2, ID3v2.3, ID3v2.4)
- MP4/M4A (iTunes metadata)
- FLAC (Vorbis Comments)

### 3. Обновлен MediaLibrary (`src/shared/services/mediaLibrary.ts`)
- Метод `createTrack()` теперь использует `metadataService.readMetadata()`
- Автоматическое извлечение обложек при сканировании
- Сохранен fallback на парсинг имени при ошибке

### 4. Обновлены типы (`src/shared/types/index.ts`)
**Добавлены поля в интерфейс Track:**
```typescript
year?: number;
genre?: string;
trackNumber?: number;
```

**Переопределен TrackMetadata:**
```typescript
interface TrackMetadata {
  title: string;
  artist: string;
  album: string;
  duration: number;
  year?: number;
  genre?: string;
  trackNumber?: number;
  coverArt?: string;
  // Технические поля
  sampleRate?: number;
  bitrate?: number;
  codec?: string;
  albumArtist?: string;
}
```

### 5. Создана TypeScript декларация (`src/shared/types/jsmediatags.d.ts`)
Добавлены типы для библиотеки jsmediatags для устранения ошибок компиляции.

### 6. Создан индексный файл (`src/shared/services/index.ts`)
Централизованный экспорт всех сервисов:
- `audioPlayerService`
- `trackPlayerService`
- `mediaLibraryService`
- `metadataService`

### 7. Документация (`docs/ID3_METADATA.md`)
Полная документация с описанием:
- Архитектуры MetadataService
- Поддерживаемых форматов
- Примеров использования
- Обработки ошибок и fallback стратегии
- Работы с обложками
- Рекомендаций по производительности

## 🔧 Технические детали

### Base64 encoding
Заменен `btoa()` на `Buffer.from().toString('base64')` для совместимости с React Native.

### Обложки
Embedded обложки конвертируются в data URI:
```
data:image/jpeg;base64,/9j/4AAQSkZJRg...
```

### Производительность
- Параллельное чтение через `Promise.all()`
- Метаданные кэшируются в Track объектах
- Для больших медиатек рекомендуется прогресс-индикатор

## 📦 Изменённые файлы

**Новые:**
- `src/shared/services/metadataService.ts` (210 строк)
- `src/shared/services/index.ts`
- `src/shared/types/jsmediatags.d.ts`
- `docs/ID3_METADATA.md`

**Обновлённые:**
- `src/shared/types/index.ts` — добавлены поля в Track
- `src/shared/services/mediaLibrary.ts` — интеграция с metadataService
- `package.json` — добавлены jsmediatags и buffer
- `PROGRESS.md` — обновлен прогресс и структура

## ✅ Проверки

- [x] TypeScript компиляция проходит без ошибок
- [x] npm install выполнен успешно (с --legacy-peer-deps)
- [x] Все сервисы экспортируются корректно
- [x] Документация создана

## 🔜 Следующие шаги

**Приоритет 1:**
1. Протестировать чтение метаданных на реальных файлах
2. Проверить отображение обложек в UI

**Приоритет 2:**
1. Реализовать экраны альбомов и исполнителей
2. Добавить поиск в медиатеке
3. Добавить прогресс-индикатор для сканирования

## 📊 Статистика

- **Строк кода добавлено:** ~290
- **Новых файлов:** 4
- **Обновлённых файлов:** 4
- **Новых зависимостей:** 2
- **Прогресс MVP:** 72% → 76%

---

**Примечания:**
- Все изменения совместимы с существующим кодом
- Fallback механизм гарантирует работу даже без ID3 тегов
- Buffer polyfill не конфликтует с другими зависимостями
