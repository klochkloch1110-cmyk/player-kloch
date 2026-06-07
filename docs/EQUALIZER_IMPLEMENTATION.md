# Реализация эквалайзера

## 📋 Обзор

Документ описывает техническое решение для интеграции 10-полосного эквалайзера с аудио-движком React Native приложения.

## 🔍 Исследование

### Текущая архитектура

**Аудио-движок:**
- `react-native-track-player` 4.1.1
- Поддержка: воспроизведение, очередь, фоновый режим, управление
- ❌ НЕ поддерживает: эквалайзер, audio effects, real-time DSP

**Эквалайзер UI:**
- 10 полос (31Hz - 16kHz)
- 8 предустановленных пресетов
- Zustand store для управления состоянием
- ✅ UI полностью реализован
- ❌ Нет реальной обработки звука

### Рассмотренные варианты

#### Вариант 1: Нативные модули (Android Equalizer API / iOS AVAudioUnitEQ)

**Плюсы:**
- ✅ Нативная производительность
- ✅ Низкая задержка
- ✅ Интеграция с системным аудио
- ✅ Работает с track-player

**Минусы:**
- ❌ Требует написания native bridge (Java/Kotlin + Objective-C/Swift)
- ❌ Разные API для Android и iOS
- ❌ Сложность поддержки и отладки
- ❌ Увеличивает время разработки (~2-3 дня)

**Оценка:** Лучший вариант для production, но требует времени

#### Вариант 2: react-native-audio-api (Web Audio API)

**Плюсы:**
- ✅ BiquadFilterNode для фильтров
- ✅ Кросс-платформенный (iOS/Android/Web)
- ✅ Современный API
- ✅ Хорошая документация

**Минусы:**
- ❌ НЕ интегрируется с react-native-track-player
- ❌ Требует полной замены плеера
- ❌ Потеря функций track-player (очередь, фон, нотификации)
- ❌ Необходима переписка всего аудио-слоя

**Оценка:** Хороший API, но слишком радикальное изменение

#### Вариант 3: Гибридный (Track Player + Audio API)

**Концепция:** Использовать track-player для воспроизведения, audio-api для effects

**Минусы:**
- ❌ Библиотеки независимы и не совместимы
- ❌ Нет способа подключить BiquadFilter к track-player output
- ❌ Двойная загрузка аудио
- ❌ Увеличенное потребление ресурсов

**Оценка:** Технически невозможно без глубокой кастомизации

#### Вариант 4: Только UI (временное решение)

**Реализация:**
- Эквалайзер управляет только UI state
- Сохраняет пользовательские настройки
- Готов к интеграции с реальным audio processing

**Плюсы:**
- ✅ Быстрая реализация (~30 минут)
- ✅ Полнофункциональный UI
- ✅ Не ломает существующий функционал
- ✅ Готов к расширению

**Минусы:**
- ❌ Нет реальной обработки звука

**Оценка:** Подходит для MVP, позволяет закончить другие фичи

## ✅ Выбранное решение

### Этап 1: UI-only эквалайзер (текущий, для MVP)

**Реализация:**
1. ✅ Эквалайзер UI с 10 полосами - **ГОТОВО**
2. ✅ Zustand store для управления - **ГОТОВО**
3. ✅ 8 пресетов - **ГОТОВО**
4. 🔄 Расширение audioPlayer service методами-заглушками
5. 🔄 Документация технического долга

**Методы-заглушки в audioPlayer:**
```typescript
// Будущие методы для native equalizer
async setEqualizerEnabled(enabled: boolean): Promise<void>
async setEqualizerBandGain(band: number, gain: number): Promise<void>
async setEqualizerPreset(preset: string): Promise<void>
```

**Преимущества:**
- MVP готов быстрее
- UX полностью функционален
- Четкий план для production версии

### Этап 2: Нативная реализация (после MVP)

**План:**
1. Написать Android Equalizer bridge (Java/Kotlin)
2. Написать iOS AVAudioUnitEQ bridge (Objective-C/Swift)
3. Создать общий TypeScript интерфейс
4. Интегрировать с track-player audio output
5. Заменить заглушки на реальные вызовы

**Ресурсы:**
- Android: [Equalizer API](https://developer.android.com/reference/android/media/audiofx/Equalizer)
- iOS: [AVAudioUnitEQ](https://developer.apple.com/documentation/avfaudio/avaudiouniteq)

**Время:** ~3-5 дней разработки + тестирование

## 📊 Технические детали

### Частоты эквалайзера (ISO)

| Band | Frequency | Type        |
|------|-----------|-------------|
| 1    | 31 Hz     | Low shelf   |
| 2    | 63 Hz     | Peaking     |
| 3    | 125 Hz    | Peaking     |
| 4    | 250 Hz    | Peaking     |
| 5    | 500 Hz    | Peaking     |
| 6    | 1 kHz     | Peaking     |
| 7    | 2 kHz     | Peaking     |
| 8    | 4 kHz     | Peaking     |
| 9    | 8 kHz     | Peaking     |
| 10   | 16 kHz    | High shelf  |

### Диапазон усиления

- **Min:** -12 dB
- **Max:** +12 dB
- **Default:** 0 dB (flat)

### BiquadFilter параметры (для будущей Web Audio реализации)

```typescript
// Пример для каждой полосы
const filter = audioContext.createBiquadFilter();
filter.type = 'peaking';
filter.frequency.value = 1000; // Hz
filter.Q.value = 1.0;
filter.gain.value = 6; // dB
```

## 🎯 Статус реализации

### ✅ Готово (MVP)
- [x] Эквалайзер UI (NeumorphicSlider)
- [x] Zustand store (equalizerStore)
- [x] 10 полос с правильными частотами
- [x] 8 пресетов (Flat, Rock, Pop, Jazz, Classical, Electronic, Hip-Hop, Vocal Boost)
- [x] Включение/выключение
- [x] Сброс к Flat
- [x] ThemeProvider интеграция

### 🔄 В процессе
- [ ] Методы-заглушки в audioPlayer
- [ ] Интеграция store с audioPlayer
- [ ] Документация API

### ⏳ Отложено (Post-MVP)
- [ ] Android native equalizer
- [ ] iOS native equalizer
- [ ] Реальная обработка звука
- [ ] Тесты audio effects
- [ ] Визуализация частотного отклика

## 📖 Использование (текущее)

```typescript
// В компоненте
const { 
  enabled, 
  bands, 
  currentPreset,
  toggleEqualizer,
  setBandGain,
  applyPreset 
} = useEqualizerStore();

// Включить/выключить
toggleEqualizer();

// Применить пресет
applyPreset('rock');

// Настроить полосу вручную
setBandGain(0, 6); // +6dB на 31Hz
```

## 🔮 Будущая реализация

```typescript
// После добавления native bridge
const { setTrack, play } = usePlayerStore();
const { enabled, bands } = useEqualizerStore();

// При изменении настроек эквалайзера
useEffect(() => {
  audioPlayerService.setEqualizerEnabled(enabled);
  bands.forEach((gain, index) => {
    audioPlayerService.setEqualizerBandGain(index, gain);
  });
}, [enabled, bands]);
```

## 📝 Технический долг

### Критичный
- Реализовать native audio effects для production

### Важный
- Добавить визуализацию частотного отклика
- Сохранение пользовательских пресетов в MMKV
- Тесты для audio processing

### Желательный
- Реализация auto-EQ (анализ трека)
- Пресеты для жанров (машинное обучение)
- Эквалайзер для микрофона (recording)

## 🔗 Полезные ссылки

- [Android Equalizer API](https://developer.android.com/reference/android/media/audiofx/Equalizer)
- [iOS AVAudioUnitEQ](https://developer.apple.com/documentation/avfaudio/avaudiouniteq)
- [Web Audio API BiquadFilter](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)
- [React Native Audio API Docs](https://docs.swmansion.com/react-native-audio-api)
- [Track Player Issue #679](https://github.com/doublesymmetry/react-native-track-player/issues/679)

## 📅 История изменений

- **2026-06-07**: Документ создан, выбрано решение UI-only для MVP
